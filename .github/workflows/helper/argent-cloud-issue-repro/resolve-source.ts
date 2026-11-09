// Finds the reproduction that an issue links and writes a descriptor for fetch-source.sh.
//
// The issue form has a "Snack or a link to a repository" field, but reporters fill it loosely:
// a plain repository, a `/tree/<branch>/<subdir>` link, a `/blob/<branch>/<file>` link, a commit, a
// gist, a Snack, prose with a link somewhere else in the body, or nothing. This script looks at the
// field first and then at the whole body, and picks the first link it can fetch. It never fetches
// anything itself; it only parses text.
//
// Usage: OWN_REPOSITORY=owner/repo node --experimental-strip-types resolve-source.ts <issue.json> <source.json>
// Links into OWN_REPOSITORY (the repository of the issue) are references to library code, not
// reproductions, so they are skipped; forks of it are not.

import fs from 'node:fs';

type Source =
  | {
      kind: 'repository';
      url: string;
      owner: string;
      repo: string;
      // The path segments after /tree/, /blob/ or /commit/, not yet split into ref and path,
      // because a branch name can contain slashes. fetch-source.sh resolves them with ls-remote.
      refAndPath: string[];
      linkKind: 'root' | 'tree' | 'blob' | 'commit';
    }
  | { kind: 'gist'; url: string; id: string }
  | { kind: 'snack'; url: string }
  | { kind: 'none'; url: null };

const NAME = /^[A-Za-z0-9_.-]+$/;
const SKIPPED_OWNERS = new Set([
  'user-attachments',
  'features',
  'orgs',
  'apps',
  'settings',
]);
const SKIPPED_ROUTES = new Set([
  'issues',
  'pull',
  'pulls',
  'discussions',
  'releases',
  'actions',
  'compare',
  'wiki',
  'projects',
  'security',
  'tags',
  'branches',
  'commits',
]);

function main(): void {
  const [issueFile, outFile] = process.argv.slice(2);
  if (!issueFile || !outFile) {
    throw new Error('usage: resolve-source.ts <issue.json> <source.json>');
  }
  const issue = JSON.parse(fs.readFileSync(issueFile, 'utf8')) as {
    body?: string | null;
  };
  const body = (issue.body ?? '').replace(/\r/g, '');
  const field = reproField(body);
  const source = pickSource(field) ??
    pickSource(body) ?? { kind: 'none', url: null };
  fs.writeFileSync(outFile, JSON.stringify(source, null, 2) + '\n');
  console.log(`reproduction source: ${JSON.stringify(source)}`);
}

// The body of an issue filed through the form has `### <field label>` headings; this returns the
// text of the reproduction field, up to the next heading.
function reproField(body: string): string {
  const match =
    /^### Snack or a link to a repository[ \t]*\n([\s\S]*?)(?=^### |(?![\s\S]))/m.exec(
      body,
    );
  return match?.[1] ?? '';
}

// A repository or a gist wins over a Snack, because only those can be fetched; the first usable
// link in the text decides.
function pickSource(text: string): Source | null {
  const candidates = text.match(/https?:\/\/[^\s<>()\[\]`'"]+/g) ?? [];
  const fallbacks: Source[] = [];
  for (const raw of candidates) {
    const source = parse(raw.replace(/[.,;:!?)]+$/, ''));
    if (!source) continue;
    if (source.kind === 'repository' || source.kind === 'gist') return source;
    fallbacks.push(source);
  }
  return fallbacks[0] ?? null;
}

// Classifies one https link. Only github.com, gist.github.com and snack.expo.dev count; GitHub
// routes that are not code (issues, releases, ...) and owner names that are GitHub features are
// skipped, and a path segment that could be a git option or a traversal rejects the link.
function parse(raw: string): Source | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase();
  // Segments are split before decoding, so an encoded slash (%2F) or dot pair stays inside one
  // segment; the check below rejects such a segment instead of letting it re-split downstream.
  let segments: string[];
  try {
    segments = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return null;
  }
  if (segments.some(segment => /[/\\\0-\x1f\x7f]/.test(segment))) return null;

  if (host === 'snack.expo.dev' || host === 'snack.expo.io') {
    return { kind: 'snack', url: url.toString() };
  }

  if (host === 'gist.github.com') {
    const id = segments[1] ?? segments[0];
    if (id && /^[0-9a-f]{20,40}$/i.test(id)) {
      return {
        kind: 'gist',
        url: `https://gist.github.com/${segments.slice(0, 2).join('/')}`,
        id,
      };
    }
    return null;
  }

  if (host !== 'github.com' && host !== 'www.github.com') return null;
  const [owner, repoRaw, route, ...rest] = segments;
  if (!owner || !repoRaw) return null;
  const repo = repoRaw.replace(/\.git$/, '');
  if (!NAME.test(owner) || !NAME.test(repo) || SKIPPED_OWNERS.has(owner))
    return null;
  if (repo.startsWith('.')) return null;
  if (route !== undefined && SKIPPED_ROUTES.has(route)) return null;
  if (
    `${owner}/${repo}`.toLowerCase() ===
    (process.env.OWN_REPOSITORY ?? '').toLowerCase()
  )
    return null;

  const base = `https://github.com/${owner}/${repo}`;
  if (route === undefined) {
    return {
      kind: 'repository',
      url: base,
      owner,
      repo,
      refAndPath: [],
      linkKind: 'root',
    };
  }
  if (route === 'tree' || route === 'blob' || route === 'commit') {
    if (rest.length === 0) return null;
    if (
      rest.some(
        segment =>
          segment === '..' ||
          segment === '.' ||
          segment.startsWith('-') ||
          segment.includes('..'),
      )
    ) {
      return null;
    }
    return {
      kind: 'repository',
      url: `${base}/${route}/${rest.join('/')}`,
      owner,
      repo,
      refAndPath: rest,
      linkKind: route,
    };
  }
  return null;
}

main();
