# react-native-screens

This project is a react-native library, focused on exposing native
navigation containers and implementing common navigation paradigms
such as stack, tabs, split.

## Repository layout tips

- `./src` - JS side of the library

  - `./src/components/gamma` - each directory inside contains JS code for new
    components, planned for next major release,
  - `./src/components/safe-area/` - code related to `SafeAreaView` component,
  - `./src/components/tabs/` - code related to `TabsHost` & `TabsScreen` components,

  - `./src/fabric/` - _codegen_ specs for the components used by the
    native code generation tool

- `./android/` - Android part of the library implementation,
- `./ios` - iOS part of the library implementation,
- `./cpp` and `./common` - C++ layer, shared between Android and iOS parts,
- `./FabricExample/` - contains an example application, we use it to showcase the library
  capabilities and test the library. It is not published as a part of the package.

- `./apps/` - extracted JS (react-native) code of the `FabricExample` application;
  this is done to share the code with other example applications in the repository.

- `./react-navigation/` - this is a git submodule for a downstream library providing
  a complete navigation solution. It is not part of the library.

## Code conventions

- TypeScript-first. Always prefer TypeScript over JavaScript unless explicitly working in a JS-only context.
- PascalCase for component names, camelCase for hooks (e.g., `useTabsNavigationContext`).
- Use context hooks when a context exists — do not pass context values as props.

## Imports

- Use relative imports within library packages (`./src`).
- Use path aliases (`@apps/*`, `@assets/*`) only in example apps (`./apps/`, `./FabricExample/`).
- Never use absolute paths from project root as import paths.

## Git & refactoring

- When renaming or deleting across the codebase, always grep for ALL references
  before committing. Verify zero stale references remain after the change.

## Code review guidelines

Be extremely frank and focused on thoroughness.
