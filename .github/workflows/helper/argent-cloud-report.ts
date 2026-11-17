import fs from 'node:fs';
import path from 'node:path';

const GITHUB_BODY_LIMIT = 60_000;
const GITHUB_TITLE_LIMIT = 256;
const SUMMARY_LIMIT = 600;
const MIRROR_PAGE_LIMIT = 20;
const SCREENSHOT_EXTENSIONS = /\.(png|jpe?g|gif|webp)$/i;
const SCREENSHOT_COLUMNS = 3;
const SCREENSHOT_WIDTH = 260;
const SCREENSHOT_LIMIT = 60;
const SCREENSHOT_BYTES_LIMIT = 2 * 1024 * 1024;
const STREAM_CHUNK_LIMIT = 10;
// writeReport puts this where the screenshots go; the publish step replaces it with them.
export const SCREENSHOTS_PLACEHOLDER = '<!-- argent-cloud-screenshots -->';
// Screenshots are committed to this branch of the reports repository, never to its default
// branch; the comments embed them from there.
const SCREENSHOTS_BRANCH = 'argent-cloud-screenshots';

export type Verdict =
  | 'REPRODUCIBLE'
  | 'NOT REPRODUCIBLE'
  | 'FALSE ISSUE'
  | 'BLOCKED';

// The files are relative to the directory, in the order they are shown.
export type Screenshots = { directory: string; files: string[] };

export type Stream = { name: string; content: string };

export type Mirror = { number: number };

// The URLs that the API returns name the reports repository in its canonical spelling, which the
// log mask may not match, so they are never logged; only numbers are.
type GithubIssue = { number: number; body?: string | null };

class GithubError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function githubHeaders(token: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function apiUrl(): string {
  return process.env.GITHUB_API_URL ?? 'https://api.github.com';
}

function mirrorMarker(origin: string, issueNumber: string): string {
  return `<!-- argent-cloud-mirror: ${origin}#${issueNumber} -->`;
}

// The original issue body is copied into the mirror, so a reporter could plant the marker of
// another issue in it and capture that issue's reports. The marker is only ever matched at the
// start of a body, and any marker-like comment in the copied text is broken so it renders as text.
function stripMarkers(text: string): string {
  return text.replace(/<!--(\s*argent-cloud-mirror)/gi, '&lt;!--$1');
}

function hasMarker(issue: GithubIssue, marker: string): boolean {
  return (issue.body ?? '').trimStart().startsWith(marker);
}

// Finds the issue in the reports repository that mirrors the original issue, or creates it with
// the original title and body. Every run of the workflow for that issue comments under it.
export async function ensureMirrorIssue({
  origin,
  issueNumber,
  issueTitle,
  issueUrl,
  issueBody,
  author,
  createdAt,
}: {
  origin: string;
  issueNumber: string;
  issueTitle: string;
  issueUrl: string;
  issueBody: string;
  author: string;
  createdAt: string;
}): Promise<Mirror> {
  const repo = requireEnv('REPORTS_REPO');
  const headers = githubHeaders(requireEnv('REPORTS_TOKEN'));
  const marker = mirrorMarker(origin, issueNumber);

  const existing = await findMirrorIssue(repo, headers, marker);
  if (existing) {
    console.log(`mirror issue exists: #${existing.number}`);
    return { number: existing.number };
  }

  const prefix = `#${issueNumber}: `;
  const room = GITHUB_TITLE_LIMIT - prefix.length;
  const title = `${prefix}${
    issueTitle.length > room ? `${issueTitle.slice(0, room - 1)}…` : issueTitle
  }`;
  const header = [
    marker,
    `> Mirror of ${issueUrl}, opened by @${author} on ${createdAt.slice(
      0,
      10,
    )}. The body below is the original issue as filed, copied verbatim. Argent Cloud runs for it are posted as comments.`,
    '',
    '---',
    '',
  ].join('\n');
  const body = clampBody(
    `${header}${stripMarkers(issueBody)}`,
    'The original issue body was truncated. Read it at the link above.',
  );
  const issue = await githubPost<GithubIssue>(
    `${apiUrl()}/repos/${repo}/issues`,
    headers,
    { title, body },
  );
  console.log(`opened mirror issue #${issue.number}`);
  return { number: issue.number };
}

// Posts the report of a run as a comment on the mirror issue, with the screenshots in a grid where
// the report has the placeholder for them, then the agent stream in chunks. The comments are posted
// with REPORTS_TOKEN, the screenshots committed with SCREENSHOTS_TOKEN; without that token, or when
// the commit fails, the comment lists the screenshots instead. Returns the URL of the comment.
export async function publishReportComment({
  mirror,
  streams,
  screenshots,
  screenshotsPrefix,
}: {
  mirror: Mirror;
  streams: Stream[];
  screenshots: Screenshots | null;
  screenshotsPrefix: string;
}): Promise<string> {
  const repo = requireEnv('REPORTS_REPO');
  const headers = githubHeaders(requireEnv('REPORTS_TOKEN'));
  const commentsUrl = `${apiUrl()}/repos/${repo}/issues/${
    mirror.number
  }/comments`;
  const report = readFile(
    process.env.REPORT_FILE ??
      (process.env.WORK_DIR
        ? path.join(process.env.WORK_DIR, 'report.md')
        : requireEnv('REPORT_FILE')),
  );
  if (!report) {
    throw new Error('the report file is missing or empty');
  }

  let gallery: string[] = [];
  if (screenshots) {
    const shown = screenshots.files.slice(0, SCREENSHOT_LIMIT);
    const names = screenshotFileNames(shown);
    const more =
      screenshots.files.length > shown.length
        ? [
            '',
            `${
              screenshots.files.length - shown.length
            } more screenshot(s) are not shown.`,
          ]
        : [];
    const token = process.env.SCREENSHOTS_TOKEN;
    try {
      if (!token) {
        throw new Error('SCREENSHOTS_TOKEN is not set');
      }
      const urls = await commitScreenshots(
        repo,
        githubHeaders(token),
        screenshots.directory,
        shown,
        names,
        screenshotsPrefix,
      );
      gallery = [...screenshotGrid(names, urls), ...more];
    } catch (err) {
      console.log(
        `::warning::could not upload the screenshots, so the comment lists them: ${String(
          err,
        )}`,
      );
      gallery = [...screenshotsSection(screenshots, names), ...more];
    }
  }

  const comment = await githubPost<{ id: number; html_url: string }>(
    commentsUrl,
    headers,
    { body: reportBody(report, gallery) },
  );
  console.log(
    `posted the report as comment ${comment.id} on #${mirror.number}`,
  );

  // A stream is capped at STREAM_CHUNK_LIMIT comments, so a runaway session cannot spend the
  // App's content-creation rate limit, which the reports of other issues share.
  for (const stream of streams) {
    const chunks = splitIntoChunks(stream.content, GITHUB_BODY_LIMIT - 200);
    const posted = chunks.slice(0, STREAM_CHUNK_LIMIT);
    for (const [index, chunk] of posted.entries()) {
      const part =
        chunks.length > 1 ? ` (part ${index + 1}/${chunks.length})` : '';
      const rest =
        index === posted.length - 1 && chunks.length > posted.length
          ? [
              '',
              `_The remaining ${
                chunks.length - posted.length
              } part(s) of the stream are not posted._`,
            ]
          : [];
      await githubPost(commentsUrl, headers, {
        body: [...detailsBlock(`${stream.name}${part}`, chunk), ...rest].join(
          '\n',
        ),
      });
    }
    console.log(
      `posted '${stream.name}' in ${posted.length} of ${chunks.length} comment(s)`,
    );
  }
  return comment.html_url;
}

// The gallery goes where the report has its placeholder, right after the agent's report, so the
// truncation of an overlong report cuts the plan, brief and JSON that come after it. The gallery
// is capped by SCREENSHOT_LIMIT, so it always fits.
function reportBody(report: string, gallery: string[]): string {
  const note =
    'The report was truncated. The full file is in the workflow artifacts.';
  const section = gallery.join('\n');
  const at = report.indexOf(SCREENSHOTS_PLACEHOLDER);
  const head = at >= 0 ? report.slice(0, at) : `${report}\n\n`;
  const rest = at >= 0 ? report.slice(at + SCREENSHOTS_PLACEHOLDER.length) : '';
  const fixed = `${head}${section}`;
  if (fixed.length + rest.length <= GITHUB_BODY_LIMIT) {
    return `${fixed}${rest}`;
  }
  if (fixed.length + note.length + 100 <= GITHUB_BODY_LIMIT) {
    return `${fixed}${clampBody(rest, note, GITHUB_BODY_LIMIT - fixed.length)}`;
  }
  return (
    clampBody(`${head}${rest}`, note, GITHUB_BODY_LIMIT - section.length - 2) +
    `\n\n${section}`
  );
}

// Commits the screenshots under `prefix` on SCREENSHOTS_BRANCH in one commit, creating the branch
// as an orphan when it does not exist, and returns the URLs that render them, in the order of the
// files. The URLs pin the commit, so a later run cannot change what an old comment shows, as long
// as the branch is never force-pushed or deleted. The reports repository must have at least one
// commit: the git database API refuses empty ones.
async function commitScreenshots(
  repo: string,
  headers: Record<string, string>,
  directory: string,
  files: string[],
  names: string[],
  prefix: string,
): Promise<string[]> {
  const git = `${apiUrl()}/repos/${repo}/git`;
  const entries = [];
  for (const [index, file] of files.entries()) {
    const blob = await githubPost<{ sha: string }>(`${git}/blobs`, headers, {
      content: fs.readFileSync(path.join(directory, file)).toString('base64'),
      encoding: 'base64',
    });
    entries.push({
      path: `${prefix}/${names[index]}`,
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
  }

  // Runs for other issues commit to the same branch, so a ref update that loses the race (422) is
  // retried on the new head after a pause; any other error is final.
  for (let attempt = 1; ; attempt++) {
    const head = await githubGetOrNull<{ object: { sha: string } }>(
      `${git}/ref/heads/${SCREENSHOTS_BRANCH}`,
      headers,
    );
    const parent = head?.object.sha;
    const base = parent
      ? (
          await githubGet<{ tree: { sha: string } }>(
            `${git}/commits/${parent}`,
            headers,
          )
        ).tree.sha
      : undefined;
    const tree = await githubPost<{ sha: string }>(`${git}/trees`, headers, {
      ...(base ? { base_tree: base } : {}),
      tree: entries,
    });
    const commit = await githubPost<{ sha: string }>(
      `${git}/commits`,
      headers,
      {
        message: `Screenshots of ${prefix}`,
        tree: tree.sha,
        parents: parent ? [parent] : [],
      },
    );
    try {
      if (parent) {
        await githubRequest(
          'PATCH',
          `${git}/refs/heads/${SCREENSHOTS_BRANCH}`,
          headers,
          { sha: commit.sha, force: false },
        );
      } else {
        await githubPost(`${git}/refs`, headers, {
          ref: `refs/heads/${SCREENSHOTS_BRANCH}`,
          sha: commit.sha,
        });
      }
    } catch (err) {
      if (!(err instanceof GithubError) || err.status !== 422 || attempt >= 3) {
        throw err;
      }
      console.log(
        `the screenshots branch moved, retrying (attempt ${attempt})`,
      );
      await new Promise(resolve =>
        setTimeout(resolve, 500 * attempt + Math.random() * 500),
      );
      continue;
    }
    console.log(
      `committed ${entries.length} screenshot(s) to ${SCREENSHOTS_BRANCH} at ${commit.sha}`,
    );
    const server = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
    return names.map(
      name => `${server}/${repo}/blob/${commit.sha}/${prefix}/${name}?raw=true`,
    );
  }
}

// The file names come from the session, so only a safe base name is kept, with its leading number
// and its extension. A screenshot without a number gets the next one after the highest number the
// agent used, so it never takes a number that the report refers to; a name that is taken gets a
// suffix and keeps its number.
function screenshotFileNames(files: string[]): string[] {
  const safe = files.map(file =>
    stripSessionId(path.basename(file))
      .replace(/[^A-Za-z0-9._-]/g, '_')
      .replace(/^[._-]+/, ''),
  );
  let next =
    Math.max(
      0,
      ...safe.map(name => Number(/^(\d+)[-_.]/.exec(name)?.[1] ?? 0)),
    ) + 1;
  const taken = new Set<string>();
  return safe.map(name => {
    const extension = SCREENSHOT_EXTENSIONS.exec(name)?.[0] ?? '';
    let stem = name.slice(0, name.length - extension.length);
    let number = /^(\d+)[-_.]/.exec(stem)?.[1];
    if (number === undefined) {
      number = String(next++).padStart(2, '0');
      stem = `${number}-${stem || 'screenshot'}`;
    }
    if (stem.length > 80) {
      stem = `${stem.slice(0, 40)}_${stem.slice(-39)}`;
    }
    let candidate = `${stem}${extension}`;
    for (let copy = 2; taken.has(candidate); copy++) {
      candidate = `${stem}-${copy}${extension}`;
    }
    taken.add(candidate);
    return candidate;
  });
}

// Three screenshots per row, each with its file name, which starts with the number that the
// agent's report refers to.
function screenshotGrid(names: string[], urls: string[]): string[] {
  const cells = names.map((name, index) => {
    const caption = name.replace(SCREENSHOT_EXTENSIONS, '');
    return `<td align="center" valign="top" width="33%"><img src="${urls[index]}" width="${SCREENSHOT_WIDTH}" alt="${caption}"><br><sub>${caption}</sub></td>`;
  });
  const rows: string[] = [];
  for (let start = 0; start < cells.length; start += SCREENSHOT_COLUMNS) {
    rows.push(
      '<tr>',
      ...cells.slice(start, start + SCREENSHOT_COLUMNS),
      '</tr>',
    );
  }
  return ['## Screenshots', '', '<table>', ...rows, '</table>'];
}

function screenshotsSection(
  screenshots: Screenshots,
  names: string[],
): string[] {
  return [
    '## Screenshots',
    '',
    `The tester took ${screenshots.files.length} screenshot(s), but they could not be uploaded. The workflow run logs say why.`,
    '',
    ...names.map(name => `- \`${name}\``),
  ];
}

// One search call finds the mirror by its marker. The search index lags a few seconds behind a
// fresh issue and search can be rate-limited, so a listing scan backs it up; a mirror that both
// miss gets a duplicate, which is only noise.
async function findMirrorIssue(
  repo: string,
  headers: Record<string, string>,
  marker: string,
): Promise<GithubIssue | null> {
  try {
    const query = encodeURIComponent(`repo:${repo} "${marker}" in:body`);
    const result = await githubGet<{ items: GithubIssue[] }>(
      `${apiUrl()}/search/issues?q=${query}&per_page=5`,
      headers,
    );
    const hit = result.items.find(issue => hasMarker(issue, marker));
    if (hit) {
      return hit;
    }
  } catch (err) {
    console.log(
      `search for the mirror failed, scanning the issues: ${String(err)}`,
    );
  }
  for (let page = 1; page <= MIRROR_PAGE_LIMIT; page++) {
    const issues = await githubGet<GithubIssue[]>(
      `${apiUrl()}/repos/${repo}/issues?state=all&sort=created&direction=desc&per_page=100&page=${page}`,
      headers,
    );
    const found = issues.find(issue => hasMarker(issue, marker));
    if (found) {
      return found;
    }
    if (issues.length < 100) {
      break;
    }
  }
  return null;
}

async function githubRequest<T>(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new GithubError(
      response.status,
      `GitHub API ${response.status} for ${method} ${url}: ${(
        await response.text()
      ).slice(0, 400)}`,
    );
  }
  return (await response.json()) as T;
}

function githubGet<T>(
  url: string,
  headers: Record<string, string>,
): Promise<T> {
  return githubRequest<T>('GET', url, headers);
}

function githubPost<T>(
  url: string,
  headers: Record<string, string>,
  body: Record<string, unknown>,
): Promise<T> {
  return githubRequest<T>('POST', url, headers, body);
}

async function githubGetOrNull<T>(
  url: string,
  headers: Record<string, string>,
): Promise<T | null> {
  const response = await fetch(url, { headers });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new GithubError(
      response.status,
      `GitHub API ${response.status} for GET ${url}: ${(
        await response.text()
      ).slice(0, 400)}`,
    );
  }
  return (await response.json()) as T;
}

// GitHub rejects bodies over 65536 characters; the note replaces the tail. A cut inside a code
// fence or a <details> block closes it, so the note and what follows it render as text.
function clampBody(
  text: string,
  note: string,
  limit: number = GITHUB_BODY_LIMIT,
): string {
  if (text.length <= limit) {
    return text;
  }
  let cut = text.slice(0, Math.max(0, limit - note.length - 200));
  if ((cut.match(/^\s*```/gm)?.length ?? 0) % 2 === 1) {
    cut += '\n```';
  }
  const open =
    (cut.match(/<details>/g)?.length ?? 0) -
    (cut.match(/<\/details>/g)?.length ?? 0);
  for (let index = 0; index < open; index++) {
    cut += '\n\n</details>';
  }
  return `${cut}\n\n_${note}_`;
}

// Splits at a newline near the limit so a chunk never ends mid-line, unless a line is absurdly long.
function splitIntoChunks(content: string, limit: number): string[] {
  const chunks: string[] = [];
  let rest = content;
  while (rest.length > limit) {
    let cut = rest.lastIndexOf('\n', limit);
    if (cut < limit / 2) {
      cut = limit;
    }
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^\n/, '');
  }
  chunks.push(rest);
  return chunks;
}

export function detailsBlock(summary: string, content: string): string[] {
  return [
    '<details>',
    `<summary>${summary}</summary>`,
    '',
    content,
    '',
    '</details>',
  ];
}

export function extractVerdict(output: string): Verdict | null {
  const firstLine = output.split('\n')[0]?.trim() ?? '';
  const match =
    /^#\s+(REPRODUCIBLE|NOT REPRODUCIBLE|FALSE ISSUE|BLOCKED)\s*$/.exec(
      firstLine,
    );
  return match ? (match[1] as Verdict) : null;
}

export function summaryOfOutput(output: string): string {
  return extractSummary(output) ?? fallbackSummary(output);
}

function extractSummary(output: string): string | null {
  const match =
    /^##\s+Summary\s*\n([\s\S]*?)(?=\n\s*\n|^#{1,6}\s|(?![\s\S]))/m.exec(
      output,
    );
  const text = match?.[1]?.trim().replace(/\s*\n\s*/g, ' ');
  return text || null;
}

function fallbackSummary(output: string): string {
  const body = output.replace(/^#[^\n]*\n/, '').trim();
  const paragraph =
    body
      .split(/\n\s*\n/)[0]
      ?.replace(/\s*\n\s*/g, ' ')
      .trim() ?? '';
  return paragraph || 'The report has no summary section. See the full report.';
}

export function clampText(text: string): string {
  return text.length > SUMMARY_LIMIT
    ? `${text.slice(0, SUMMARY_LIMIT - 1)}…`
    : text;
}

export function configurationLabel(configuration: string | undefined): string {
  return configuration === 'debug'
    ? 'Debug, JavaScript from Metro'
    : 'Release, embedded bundle';
}

// Reads the screenshots of the session, which must be in the output directory of the run under
// WORK_DIR: SCREENSHOTS_DIR is a step output, and a step output is the kind of value that agent text
// in a log could try to set. Only regular files up to SCREENSHOT_BYTES_LIMIT whose bytes are an
// image of their extension's kind are kept.
export function readScreenshots(
  directory: string | undefined,
): Screenshots | null {
  if (!directory || !fs.existsSync(directory) || !process.env.WORK_DIR) {
    return null;
  }
  const root = fs.realpathSync(path.join(process.env.WORK_DIR, 'output'));
  const real = fs.realpathSync(directory);
  if (!real.startsWith(`${root}${path.sep}`)) {
    console.log(
      '::warning::the screenshots directory is outside the output directory of the run; it is ignored',
    );
    return null;
  }
  // The tester names every screenshot with its number, so the numeric order of the base names is
  // the order it took them in.
  const collator = new Intl.Collator('en', { numeric: true });
  const files = fs
    .readdirSync(real, { recursive: true, encoding: 'utf8' })
    .filter(file => {
      // lstat: the archive comes from the session, and a symlink in it could point at any file on
      // the runner, such as /proc/self/environ.
      const full = path.join(real, file);
      const stat = fs.lstatSync(full);
      return (
        SCREENSHOT_EXTENSIONS.test(file) &&
        stat.isFile() &&
        stat.size <= SCREENSHOT_BYTES_LIMIT &&
        isImage(full)
      );
    })
    .sort(
      (a, b) =>
        collator.compare(path.basename(a), path.basename(b)) ||
        collator.compare(a, b),
    );
  return files.length > 0 ? { directory: real, files } : null;
}

function isImage(file: string): boolean {
  const head = Buffer.alloc(12);
  const descriptor = fs.openSync(file, 'r');
  try {
    fs.readSync(descriptor, head, 0, 12, 0);
  } finally {
    fs.closeSync(descriptor);
  }
  return (
    head.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')) ||
    head.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex')) ||
    head.subarray(0, 6).toString('latin1') === 'GIF87a' ||
    head.subarray(0, 6).toString('latin1') === 'GIF89a' ||
    (head.subarray(0, 4).toString('latin1') === 'RIFF' &&
      head.subarray(8, 12).toString('latin1') === 'WEBP')
  );
}

// Agent text goes into comments in the reports repository. It must not notify anyone there, load
// images from other hosts (which tells their owner when the report is read), or bring HTML of its
// own: a comment, a `<details>` or a tag that would hide or forge the parts this script writes.
export function neutralizeAgentText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(
      /!\[([^\]]*)\]\(([^)]*)\)/g,
      (_match, alt: string) => `[image: ${alt || 'removed'}]`,
    )
    .replace(/(^|[^\w`])@([A-Za-z0-9-]+)/g, '$1@\u200b$2');
}

export function escapeSlack(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatUsd(value: number): string {
  if (value > 0 && value < 0.005) {
    return '<$0.01';
  }
  return `$${value.toFixed(2)}`;
}

export function parseCost(value: string | undefined | null): number {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function readJsonObject<T>(file: string | undefined): T | null {
  const content = readFile(file);
  if (!content) {
    return null;
  }
  const parsed: unknown = JSON.parse(content);
  return typeof parsed === 'object' && parsed !== null ? (parsed as T) : null;
}

// The session ID lets anyone with the Argent Cloud key download the session, so it never reaches
// a comment: every occurrence of the ID that the run step read (SESSION_ID), the `session-id=` line
// that argent-cloud prints last, and the other forms that the CLI and the agent write.
export function stripSessionId(text: string): string {
  const id = process.env.SESSION_ID;
  let result = id ? text.split(id).join('<session>') : text;
  result = result
    .replace(/^[ \t]*session-id=\S*[ \t\r]*$\n?/gm, '')
    .replace(
      /\b(session[-_ ]?id\b["']?\s*[:=]\s*["']?)[A-Za-z0-9_.-]+/gi,
      '$1<session>',
    );
  return result;
}

export function readFile(file: string | undefined): string | null {
  if (!file || !fs.existsSync(file)) {
    return null;
  }
  const content = fs.readFileSync(file, 'utf8').trim();
  return content || null;
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}
