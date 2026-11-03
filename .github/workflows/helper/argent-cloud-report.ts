import fs from 'node:fs';
import path from 'node:path';

const GITHUB_BODY_LIMIT = 60_000;
const GITHUB_TITLE_LIMIT = 256;
const SUMMARY_LIMIT = 600;
const COMMENT_REPORT_LIMIT = 25_000;
const MIRROR_PAGE_LIMIT = 20;
const SCREENSHOT_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg)$/i;

export type Verdict =
  | 'REPRODUCIBLE'
  | 'NOT REPRODUCIBLE'
  | 'FALSE ISSUE'
  | 'BLOCKED';

export type Screenshots = { files: string[]; artifactUrl: string | undefined };

export type Stream = { name: string; content: string };

export type Mirror = { number: number; url: string };

type GithubIssue = { number: number; html_url: string; body?: string | null };

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
    console.log(`mirror issue exists: ${existing.html_url}`);
    return { number: existing.number, url: existing.html_url };
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
  console.log(`opened mirror issue ${issue.html_url}`);
  return { number: issue.number, url: issue.html_url };
}

// Posts the report of a run, and the agent stream in chunks, as comments on the mirror issue.
export async function publishReportComment({
  mirror,
  streams,
}: {
  mirror: Mirror;
  streams: Stream[];
}): Promise<string> {
  const repo = requireEnv('REPORTS_REPO');
  const headers = githubHeaders(requireEnv('REPORTS_TOKEN'));
  const report = readFile(
    process.env.REPORT_FILE ??
      (process.env.WORK_DIR
        ? path.join(process.env.WORK_DIR, 'report.md')
        : requireEnv('REPORT_FILE')),
  );
  if (!report) {
    throw new Error('the report file is missing or empty');
  }
  const comment = await githubPost<GithubIssue>(
    `${apiUrl()}/repos/${repo}/issues/${mirror.number}/comments`,
    headers,
    {
      body: clampBody(
        report,
        'The report was truncated. The full file is in the workflow artifacts.',
      ),
    },
  );
  console.log(`posted the report at ${comment.html_url}`);

  for (const stream of streams) {
    const chunks = splitIntoChunks(stream.content, GITHUB_BODY_LIMIT - 200);
    for (const [index, chunk] of chunks.entries()) {
      const part =
        chunks.length > 1 ? ` (part ${index + 1}/${chunks.length})` : '';
      await githubPost(
        `${apiUrl()}/repos/${repo}/issues/${mirror.number}/comments`,
        headers,
        { body: detailsBlock(`${stream.name}${part}`, chunk).join('\n') },
      );
    }
    console.log(`posted '${stream.name}' in ${chunks.length} comment(s)`);
  }
  return comment.html_url;
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
    console.log(`search for the mirror failed, scanning the issues: ${String(err)}`);
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

async function githubGet<T>(
  url: string,
  headers: Record<string, string>,
): Promise<T> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status} for ${url}: ${(
        await response.text()
      ).slice(0, 400)}`,
    );
  }
  return (await response.json()) as T;
}

async function githubPost<T>(
  url: string,
  headers: Record<string, string>,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status} for ${url}: ${(
        await response.text()
      ).slice(0, 400)}`,
    );
  }
  return (await response.json()) as T;
}

// GitHub rejects bodies over 65536 characters; the note replaces the tail.
function clampBody(text: string, note: string): string {
  if (text.length <= GITHUB_BODY_LIMIT) {
    return text;
  }
  return `${text.slice(0, GITHUB_BODY_LIMIT - note.length - 4)}\n\n_${note}_`;
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

// The agent's report is untrusted text. On the public issue it must not notify arbitrary users,
// embed foreign images or inject HTML; the private reports repository gets it as written.
export function neutralizeForPublic(text: string): string {
  return text
    .replace(/<[^>]+>/g, match => match.replace(/</g, '&lt;'))
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt: string, url: string) =>
      /^https:\/\/(github\.com|user-images\.githubusercontent\.com|private-user-images\.githubusercontent\.com)\//.test(url)
        ? match
        : `[image: ${alt || 'removed'}]`,
    )
    .replace(/(^|[^\w`])@([A-Za-z0-9-]+)/g, '$1@\u200b$2');
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

export function screenshotsSection(
  heading: string,
  screenshots: Screenshots,
): string[] {
  return [
    heading,
    '',
    screenshots.artifactUrl
      ? `The tester took ${screenshots.files.length} screenshot(s). Download them from ${screenshots.artifactUrl}.`
      : `The tester took ${screenshots.files.length} screenshot(s). They are in the workflow artifacts.`,
    '',
    ...screenshots.files.map(file => `- \`${file}\``),
    '',
  ];
}

export function writeCommentFile(lines: string[]): void {
  const commentFile = requireEnv('COMMENT_FILE');
  fs.mkdirSync(path.dirname(commentFile), { recursive: true });
  fs.writeFileSync(
    commentFile,
    clampBody(
      lines.join('\n'),
      'The comment was truncated. The full report is in the workflow artifacts.',
    ),
  );
  console.log(`wrote ${commentFile}`);
}

export function reportForComment(output: string, publicComment = false): string {
  let report = output
    .replace(/^#\s+[^\n]*\n/, '')
    .trim()
    .replace(/^(#{1,5})\s/gm, '$1## ');
  if (publicComment) {
    report = neutralizeForPublic(report);
  }
  if (report.length <= COMMENT_REPORT_LIMIT) {
    return report;
  }
  const note =
    '\n\n_The report was truncated. The full report is in the workflow artifacts._';
  const cut = report.slice(0, COMMENT_REPORT_LIMIT - note.length - 8);
  const openFence = (cut.match(/^```/gm)?.length ?? 0) % 2 === 1;
  return `${cut}${openFence ? '\n```' : ''}${note}`;
}

export function commentFooter(runUrl: string): string[] {
  return [
    `<sub>Posted by the [Argent Cloud workflow](${runUrl}). An AI agent ran this on an iOS simulator, so the result can be wrong.</sub>`,
  ];
}

export function configurationLabel(configuration: string | undefined): string {
  return configuration === 'debug'
    ? 'Debug, JavaScript from Metro'
    : 'Release, embedded bundle';
}

export function readScreenshots(
  directory: string | undefined,
  artifactUrl: string | undefined,
): Screenshots | null {
  if (!directory || !fs.existsSync(directory)) {
    return null;
  }
  const files = fs
    .readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter(
      file =>
        SCREENSHOT_EXTENSIONS.test(file) &&
        fs.statSync(path.join(directory, file)).isFile(),
    )
    .sort();
  return files.length > 0
    ? { files, artifactUrl: artifactUrl || undefined }
    : null;
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
