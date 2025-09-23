import React from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  ViewProps,
  StyleSheet,
} from 'react-native';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';

type Props = ViewProps & {
  contentStyle?: StyleProp<ViewStyle>;
};

function ScreenContentWrapper({ children, contentStyle, ...rest }: Props) {
  return (
    <ScreenContentWrapperNativeComponent {...rest} collapsable={false}>
      <View style={[styles.container, contentStyle]}>{children}</View>
    </ScreenContentWrapperNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});

export default ScreenContentWrapper;
