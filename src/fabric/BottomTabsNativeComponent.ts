'use client';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';

// TODO: Report issue on RN repo, that nesting color value inside a struct does not work.
// Generated code is ok, but the value is not passed down correctly - whatever color is set
// host component receives RGBA(0, 0, 0, 0) anyway.
type TabBarAppearance = Readonly<{
  backgroundColor?: ColorValue;
}>;

export interface NativeProps extends ViewProps {
  tabBarAppearance?: TabBarAppearance;
  tabBarBackgroundColor?: ColorValue;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabs', {});
