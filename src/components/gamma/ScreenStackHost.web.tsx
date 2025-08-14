import { View, ViewProps } from 'react-native';

interface NativeProps extends ViewProps {}

export type ScreenStackNativeProps = NativeProps & {
  // Overrides
};

const ScreenStackHost = View;

export default ScreenStackHost;
