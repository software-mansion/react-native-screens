import { View } from 'react-native';

const Column = View;
const Inspector = View;

console.warn(
  'SplitView is supported only for iOS. Consider using an alternative layout for Android.',
);

export default { Column, Inspector };
