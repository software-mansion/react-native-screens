---
name: check-public-api
description: Use before committing, opening, or reviewing a pull request that changes the v5 public API or its doc comments in `src/components/` or `src/types.ts`. Runs the repository checks and the mechanical checks, then walks the rules of `public-api-types` and `doc-comments` against the changed declarations.
---

# Checking a change to the v5 public API

## 1. Repository checks

```bash
yarn check-types
yarn lint-js
yarn format-js
```

`check-types` must pass. `lint-js` (`eslint --fix`) and `format-js`
(`prettier --write` over `src`, `FabricExample` and `apps`) fix what they can
and rewrite files instead of failing, so run `git diff` afterwards: `lint-js`
must report no errors, and every rewrite belongs in the change or is reverted.

## 2. Mechanical checks

The changed files, new ones included:

```bash
git diff --name-only --merge-base origin/main -- src/components src/types.ts
git ls-files --others --exclude-standard -- src/components src/types.ts
```

In those files, each of these must find nothing:

```bash
grep -nE '@since|@summary|@description|@supported|@default\b' <files>
grep -nE '\{@link [A-Za-z0-9_.]+#' <files>
grep -nE '\* *((Note|NOTE|Tip|Important|Warning|Example):|See also|Defaults to)' <files>
```

**No `@since` may be added**, in any form: comments do not mention library
versions. A version belongs in `@platform`, and only when it is above the
library's minimum. A `@since` already in a touched file is removed.

The tags used must be on this list (nothing in the repository rejects an
unknown one):

```bash
grep -ohE '@[a-zA-Z]+' <files> | sort | uniq -c
```

Allowed: `@remarks`, `@note`, `@tip`, `@info`, `@warning`, `@danger`,
`@defaultValue`, `@typeParam`, `@param`, `@returns`, `@example`, `@see`,
`@namespace`, `@platform`, `@experimental`, `@deprecated`, `@link`. Anything
else in the output is either code (decorators, `@` in strings) or a tag to fix.

Nothing in the repository checks where a `{@link}` points either. List the
targets:

```bash
grep -ohE '\{@link [^}| ]+' <files> | sort -u
```

For each target:

- `X` or `X.y`: `X` is a type listed in a family barrel's
  `export type { … }` or in `src/types.ts`, or a component users write
  (`FormSheet`, `Tabs.Host`). `y` is declared in `X` itself under exactly that
  name, not only inherited from a base; otherwise link through the type that
  declares it.
- A URL: it opens, and the page is the one the text describes.

## 3. Declarations

Go through each section of the `public-api-types` skill for every type, prop
and field the change adds or changes. The items most often missed:

- [ ] The type is listed in the family barrel's `export type { … }` (or in
      `src/types.ts`), not only marked `export` in its file.
- [ ] Each component has its own `<Component>Props`.
- [ ] No inline union or object on a prop or field.
- [ ] A common type is used through a family alias only where a prop or field
      uses it directly; no alias that nothing uses.
- [ ] Optional members are `name?: Type | undefined`.

## 4. Doc comments

Go through the `doc-comments` skill for every comment the change adds or
changes. The items most often missed:

- [ ] `@platform` on every component, prop, field, command and `ios` /
      `android` key — and on no type and no union value.
- [ ] Every platform and version checked in the native code and in the
      availability of the platform API it calls.
- [ ] A version only above the minimum, read from `RNScreens.podspec` and
      `android/build.gradle` as `doc-comments` describes (report it if a
      minimum is missing there); no "available from" text.
- [ ] `@defaultValue` on every prop with a default.
- [ ] Tag order: Description, More information, Metadata.
- [ ] `{@link}` for the first mention of a library component, prop or type
      within one comment (one type, prop, field, component or command); never
      to the prop itself or its own type.
- [ ] Every link target exists and is exported, and every URL opens (step 2).
- [ ] A prop does not repeat its type's values, fields or behaviour.
- [ ] Comment text wraps at 80 columns.

## 5. Scope

- [ ] The diff contains only what the task is about. Code or comments outside
      the task that break the rules are not changed, only listed in the
      report (file and line) for a separate pull request.
- [ ] Existing comments that the change makes wrong (on other props, on the
      component, on the types it touches) are updated.
- [ ] A renamed or removed exported type breaks users' imports, even in an
      experimental API or a beta; the pull request says so.
- [ ] A new component, family or `<Component>PropsBase` needs a change in the
      docs generator, which lives outside this repository. Do not look for it;
      only tell the user in the report that the generator will need an update.

Report anything that fails, with the file and line, before committing.
