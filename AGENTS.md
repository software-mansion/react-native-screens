# react-native-screens

This project is a react-native library, focused on exposing native
navigation containers and implementing common navigation paradigms
such as stack, tabs, split.

## Repository layout tips

- `./src/` - JS side of the library

  - `./src/components/gamma/` - each directory inside contains JS code for new
    components, planned for next major release,
  - `./src/components/safe-area/` - code related to `SafeAreaView` component,
  - `./src/components/tabs/` - code related to `TabsHost` & `TabsScreen` components,

  - `./src/fabric/` - _codegen_ specs for the components used by the
    native code generation tool

- `./android/` - Android part of the library implementation,
- `./ios/` - iOS part of the library implementation,
- `./cpp/` and `./common/` - C++ layer, shared between Android and iOS parts,
- `./FabricExample/` - contains an example application, we use it to showcase the library
  capabilities and test the library. It is not published as part of the package.

- `./TVOSExample/` - tvOS example application, used to exercise the library on
  Apple TV. Like `FabricExample`, it consumes the shared sources from `./apps/`
  via path aliases. Not published as part of the package.

- `./apps/` - extracted JS (react-native) code of the `FabricExample` application;
  this is done to share the code with other example applications in the repository.

- `./react-navigation/` - this is a git submodule for a downstream library providing
  a complete navigation solution. It is not part of the library.

## Build & run

### Prerequisites

- `yarn install` — installs JS dependencies. Triggers the `prepare` lifecycle
  hook, which builds the library to `./lib/` (see below).
- `yarn submodules` — initializes and builds the `react-navigation` git
  submodule. Only needed when working against that downstream library; not
  required to build or type-check the screens library itself.

### Build the library

```bash
yarn prepare
```

Runs `bob build` (`react-native-builder-bob`) and `husky install`. Outputs:

- `./lib/commonjs/` — CommonJS build
- `./lib/module/` — ES module build
- `./lib/typescript/` — `.d.ts` declarations (built via `tsconfig.build.json`)

Source of truth is `./src/` (see `react-native-builder-bob` config in
`package.json`).

### Verify TypeScript

Library:

```bash
yarn check-types
```

Runs `tsc --noEmit` against the root `tsconfig.json` (covers `./src/`).

> Type-checking the example apps directly (`FabricExample/`, `TVOSExample/`,
> `apps/`) is intentionally not documented here yet. Each app's `tsconfig.json`
> currently surfaces a different set of pre-existing errors when run on its
> own, and there are no `check-types` scripts in the example app
> `package.json` files. This will be documented once the underlying issues
> are resolved and a single entry point exists.

## Code conventions

- TypeScript-first. Always prefer TypeScript over JavaScript unless explicitly working in a JS-only context.
- PascalCase for component names, camelCase for hooks (e.g., `useTabsNavigationContext`).
- Use context hooks when a context exists — do not pass context values as props.

## Imports

- Use relative imports within library packages (`./src/`).
- Use path aliases (`@apps/*`, `@assets/*`) only in example apps (`./apps/`, `./FabricExample/`, `./TVOSExample/`).
- Never use absolute paths from project root as import paths.

## Git & refactoring

- When renaming or deleting across the codebase, always grep for ALL references
  before committing. Verify zero stale references remain after the change.

## Code review guidelines

Be extremely frank and focused on thoroughness.
