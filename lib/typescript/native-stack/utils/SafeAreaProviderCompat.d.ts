import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
declare type Props = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};
declare function SafeAreaProviderCompat({ children, style }: Props): React.JSX.Element;
declare namespace SafeAreaProviderCompat {
    var initialMetrics: import("react-native-safe-area-context").Metrics;
}
export default SafeAreaProviderCompat;
