# tabsAndStack4.x

Tabs + legacy V4 `ScreenStack` / `ScreenStackItem` from the main export. No experimental APIs.

## Requirements

|         |                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------- |
| **RNS** | 4.x (e.g. `4.26-stable`, `4.26.2`). For RNS 5.x / `main`, use `tabsAndStack` instead.                   |
| **RN**  | Fabric required (RN ≥ 0.76). Match the RNS ↔ RN matrix from the library README for the release you use. |

## Imports

- `Tabs`, `ScreenStack`, `ScreenStackItem` from `react-native-screens`
- No `react-native-screens/experimental` imports

## Setup

```bash
node release_tests/create_playground.js -s branch:4.26-stable -r 0.84.0 -o -e tabsAndStack4.x
```
