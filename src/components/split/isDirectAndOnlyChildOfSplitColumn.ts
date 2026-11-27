import type { HostInstance } from 'react-native';

// React Native prefixes the name of a native component with `RN:`.
const SPLIT_COLUMN_TAG_NAME = 'RN:RNSSplitScreen';

export default function isDirectAndOnlyChildOfSplitColumn(
  instance: HostInstance | null,
) {
  const parent = instance?.parentElement;
  return (
    parent?.tagName === SPLIT_COLUMN_TAG_NAME && parent.childNodes.length === 1
  );
}
