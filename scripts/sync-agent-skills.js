/*
 * Keeps shared AI tooling usable across agents.
 *
 * Skills live in `.agents/skills/<name>/SKILL.md` (the cross-agent location),
 * but Claude Code only discovers skills under `.claude/skills/`. By default
 * this script links every skill from `.agents/skills/` into `.claude/skills/`:
 *
 * 1. A link is created only when `.claude/skills/<name>` does not exist yet,
 *    so personal skills with the same name are never overwritten.
 * 2. Links created by this script whose skill no longer exists are removed.
 *    Anything else in `.claude/skills/` is left untouched.
 *
 * The links are gitignored, so nothing platform-specific is committed (git
 * checks out symlinks as plain files on Windows without `core.symlinks`).
 *
 * With `--check`, the script instead validates the skills and agents tracked
 * in git (used in CI):
 *
 * 1. Every tracked skill has a `SKILL.md` whose frontmatter `name` matches its
 *    directory and which has a `description`.
 * 2. Every tracked agent in `.claude/agents/` has a `name` and a `description`.
 * 3. No tracked file contains an absolute home directory path, which would
 *    only work on its author's machine.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const AGENTS_SKILLS_DIR = path.join(ROOT, '.agents', 'skills');
const CLAUDE_SKILLS_DIR = path.join(ROOT, '.claude', 'skills');
const CLAUDE_AGENTS_DIR = path.join(ROOT, '.claude', 'agents');

const HOME_PATH = /\/Users\/[^/\s]+|\/home\/[^/\s]+|[A-Za-z]:\\Users\\/;

function listSkillNames() {
  if (!fs.existsSync(AGENTS_SKILLS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(AGENTS_SKILLS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name =>
      fs.existsSync(path.join(AGENTS_SKILLS_DIR, name, 'SKILL.md')),
    );
}

// Returns true for links in `.claude/skills/` that point into
// `.agents/skills/`, i.e. the ones this script manages.
function isManagedLink(linkPath) {
  const stat = fs.lstatSync(linkPath, { throwIfNoEntry: false });
  if (!stat || !stat.isSymbolicLink()) {
    return false;
  }
  const target = path.resolve(
    path.dirname(linkPath),
    fs.readlinkSync(linkPath),
  );
  return path.dirname(target) === AGENTS_SKILLS_DIR;
}

function linkSkill(name) {
  const linkPath = path.join(CLAUDE_SKILLS_DIR, name);
  const targetPath = path.join(AGENTS_SKILLS_DIR, name);
  if (process.platform === 'win32') {
    // Junctions work without admin rights but need an absolute target.
    fs.symlinkSync(targetPath, linkPath, 'junction');
  } else {
    fs.symlinkSync(path.relative(CLAUDE_SKILLS_DIR, targetPath), linkPath);
  }
}

function sync() {
  fs.mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });

  const skillNames = new Set(listSkillNames());
  const linked = [];
  const skipped = [];
  const removed = [];

  for (const name of skillNames) {
    const linkPath = path.join(CLAUDE_SKILLS_DIR, name);
    if (isManagedLink(linkPath)) {
      continue;
    }
    if (fs.lstatSync(linkPath, { throwIfNoEntry: false })) {
      skipped.push(name);
      continue;
    }
    linkSkill(name);
    linked.push(name);
  }

  for (const name of fs.readdirSync(CLAUDE_SKILLS_DIR)) {
    const linkPath = path.join(CLAUDE_SKILLS_DIR, name);
    if (
      isManagedLink(linkPath) &&
      !fs.existsSync(path.join(AGENTS_SKILLS_DIR, name, 'SKILL.md'))
    ) {
      fs.unlinkSync(linkPath);
      removed.push(name);
    }
  }

  linked.forEach(name => console.log(`linked   ${name}`));
  removed.forEach(name => console.log(`removed  ${name}`));
  skipped.forEach(name =>
    console.log(`skipped  ${name} (.claude/skills/${name} already exists)`),
  );
  console.log(
    `${skillNames.size} skill(s) in .agents/skills: ` +
      `${linked.length} linked, ${removed.length} removed, ` +
      `${skipped.length} skipped.`,
  );
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) {
    return null;
  }
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (field) {
      // Unquote `"foo"` / `'foo'`; full YAML parsing is not needed here.
      fields[field[1]] = field[2].trim().replace(/^(["'])(.*)\1$/, '$2');
    }
  }
  return fields;
}

function listTrackedFiles(dir) {
  const output = execFileSync(
    'git',
    ['ls-files', '-z', '--', path.relative(ROOT, dir)],
    { cwd: ROOT, encoding: 'utf8' },
  );
  return output
    .split('\0')
    .filter(Boolean)
    .map(file => path.join(ROOT, file));
}

function check() {
  const errors = [];
  const report = (file, message) =>
    errors.push(`${path.relative(ROOT, file)}: ${message}`);

  const skillFiles = listTrackedFiles(AGENTS_SKILLS_DIR);
  const agentFiles = listTrackedFiles(CLAUDE_AGENTS_DIR);

  const skillDirs = new Set(
    skillFiles
      .map(file => path.relative(AGENTS_SKILLS_DIR, file).split(path.sep))
      .filter(parts => parts.length > 1)
      .map(parts => parts[0]),
  );
  for (const name of skillDirs) {
    const skillFile = path.join(AGENTS_SKILLS_DIR, name, 'SKILL.md');
    if (!skillFiles.includes(skillFile)) {
      report(skillFile, 'missing (every skill needs a SKILL.md)');
      continue;
    }
    const fields = parseFrontmatter(fs.readFileSync(skillFile, 'utf8'));
    if (!fields) {
      report(skillFile, 'missing frontmatter');
    } else {
      if (fields.name !== name) {
        report(skillFile, `frontmatter name must be "${name}"`);
      }
      if (!fields.description) {
        report(skillFile, 'frontmatter description is missing');
      }
    }
  }

  for (const agentFile of agentFiles) {
    if (path.extname(agentFile) !== '.md') {
      continue;
    }
    const fields = parseFrontmatter(fs.readFileSync(agentFile, 'utf8'));
    if (!fields || !fields.name || !fields.description) {
      report(agentFile, 'frontmatter needs a name and a description');
    }
  }

  for (const file of [...skillFiles, ...agentFiles]) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (HOME_PATH.test(line)) {
        report(file, `line ${index + 1} contains an absolute home path`);
      }
    });
  }

  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(
    `Checked ${skillDirs.size} skill(s) and ${agentFiles.length} agent ` +
      'file(s): OK.',
  );
}

if (process.argv.includes('--check')) {
  check();
} else {
  sync();
}
