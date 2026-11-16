import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import StackHostNativeComponent from '../../../fabric/stack/StackHostNativeComponent';
import type { StackHostProps } from './StackHost.types';
import SplitColumnMarkerContext from '../../split/SplitColumnMarkerContext';

function StackHost(props: StackHostProps) {
  const { children, ref, direction, ...restProps } = props;

  // Android lays the native subtree out by the View's layoutDirection, which RN
  // sets from the `direction` style on every layout. iOS lays system views out by
  // the layoutDirection trait, which the native side overrides from
  // `layoutDirection`.
  const directionStyle = Platform.OS === 'android' ? { direction } : undefined;

  const headlessModeEnabled =
    React.useContext(SplitColumnMarkerContext) && Platform.OS === 'ios';

  return (
    <StackHostNativeComponent
      ref={ref}
      style={[
        styles.container,
        directionStyle,
        headlessModeEnabled && styles.headless,
      ]}
      layoutDirection={direction}
      {...restProps}
      headlessModeEnabled={headlessModeEnabled}>
      {children}
    </StackHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headless: {
    display: 'contents',
  },
});

export default StackHost;
