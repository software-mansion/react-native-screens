import { View } from 'react-native';

const SplitViewHost = View;

console.warn(
  'SplitView is supported only for iOS. Consider using an alternative layout for Android.',
);

export default SplitViewHost;
