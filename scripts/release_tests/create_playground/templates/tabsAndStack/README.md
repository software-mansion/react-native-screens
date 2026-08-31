# tabsAndStack

Tabs + Stack v5 from the main `react-native-screens` export.

## Requirements

|         |                                                                                             |
| ------- | ------------------------------------------------------------------------------------------- |
| **RNS** | 5.x                                                                                         |
| **RN**  | Fabric required. Match the RNS ↔ RN matrix from the library README for the release you use. |

## Imports

- `Stack`, `Tabs` from `react-native-screens`
- `SafeAreaView` from `react-native-screens/experimental`

## Setup

```bash
node scripts/release_tests/create_playground.js -s current -t tabsAndStack
# or
node scripts/release_tests/create_playground.js -s tag:5.0.0-alpha.1 -r 0.84.0 -t tabsAndStack
```
