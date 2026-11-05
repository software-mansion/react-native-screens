---
name: add-shared-agent-tooling
description: Use when adding, sharing, renaming, or removing a skill or agent that is checked into this repository (`.agents/skills/` or `.claude/agents/`). Covers where the files go, opting them into git, and validating them with `yarn check-agent-config`. Not about how to write the skill or agent prompt itself.
---

# Adding a shared skill or agent

Shared skills and agents are committed to the repository. Everything else
under `.agents/` and `.claude/` is gitignored and stays local. This skill
covers only this repository's rules; for how to write a good skill or agent
prompt, use your tool's general guidance.

## 1. Pick the location

| Kind  | Location                                                          |
| ----- | ----------------------------------------------------------------- |
| Skill | `.agents/skills/<name>/SKILL.md` (supporting files go next to it) |
| Agent | `.claude/agents/<name>.md`                                        |

`<name>` is kebab-case. Make sure it is not taken yet in `.agents/skills/`,
`.claude/skills/` or `.claude/agents/`.

## 2. Add the frontmatter

Both kinds need `name` and `description`. A skill's `name` must match its
directory name. The description is the only part an agent always sees, so
state what it does and when to use it.

```markdown
---
name: <name>
description: Use when ...
---
```

## 3. Keep it independent of your machine

- No absolute paths into a home directory (under `/Users`, `/home` or
  `C:\Users`). Use paths relative to the repository root.
- No dependency on locally installed tools, credentials or personal
  configuration. If a tool is required, say so and how to install it.
- An agent that needs memory uses `memory: project`, never a hardcoded
  directory. `.claude/agent-memory/` stays local.

## 4. Opt it into git

Add an entry to `.gitignore`, below the comment that ends with
"go below.":

```gitignore
!/.agents/skills/<name>/
!/.claude/agents/<name>.md
```

Then `git status` must list the new files, and `git check-ignore -v <path>`
must print nothing.

## 5. Validate

`yarn check-agent-config` reads only files in the git index, so stage them
first:

```bash
git add .gitignore <new files>
yarn check-agent-config
```

Fix every reported error.

## 6. Link a skill for Claude Code

Claude Code reads skills only from `.claude/skills/`. For a skill, run:

```bash
yarn sync-agent-skills
```

Agents in `.claude/agents/` are read directly and need no linking.

## Renaming or removing

1. Rename or delete the files and update the `.gitignore` entry.
2. For a skill, delete the old link `.claude/skills/<old-name>` by hand;
   `yarn sync-agent-skills` never removes links. Run it again after a
   rename.
3. Grep the repository for the old name and update every reference.
4. Run `yarn check-agent-config`.
