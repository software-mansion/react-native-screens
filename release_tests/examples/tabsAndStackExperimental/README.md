# tabsAndStackExperimental

Tabs from main export + Stack v5 from `react-native-screens/experimental` (gamma).

## Requirements

|                  |                                                                                  |
| ---------------- | -------------------------------------------------------------------------------- |
| **RNS**          | 4.x (e.g. `4.26-stable`, `4.26.2`)                                               |
| **RN**           | Fabric required (RN ≥ 0.76). For RNS **4.26.0+**, RN **0.84.0+** is recommended. |
| **Gamma** (`-g`) | **Required** — enables native gamma sources on iOS (`--gamma`)                   |

## Imports

- `Tabs` from `react-native-screens`
- `Stack`, `SafeAreaView` from `react-native-screens/experimental`

## Setup

```bash
node release_tests/create_playground.js -s 4.26-stable -r 0.84.0 -f -e tabsAndStackExperimental -g
```
