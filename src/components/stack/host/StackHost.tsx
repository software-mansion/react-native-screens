import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { HostInstance } from 'react-native';
import StackHostNativeComponent from '../../../fabric/stack/StackHostNativeComponent';
import type { StackHostProps } from './StackHost.types';
import SplitColumnMarkerContext from '../../split/SplitColumnMarkerContext';
import isDirectAndOnlyChildOfSplitColumn from '../../split/isDirectAndOnlyChildOfSplitColumn';
import { useMergeRefs } from '../../shared/mergeRefs';

function StackHost(props: StackHostProps) {
  const { children, ref, direction, ...restProps } = props;

  // RN's `direction` style sets the native View's layoutDirection, which the
  // stack's native subtree inherits. iOS needs a trait override instead.
  const directionStyle = Platform.OS === 'android' ? { direction } : undefined;

  const nativeRef = React.useRef<HostInstance>(null);
  const mergedRef = useMergeRefs([nativeRef, ref]);

  const isRenderedInSplitColumn =
    React.useContext(SplitColumnMarkerContext) && Platform.OS === 'ios';
  const [isMisplacedInSplitColumn, setIsMisplacedInSplitColumn] =
    React.useState(false);

  React.useLayoutEffect(() => {
    if (
      isRenderedInSplitColumn &&
      !isDirectAndOnlyChildOfSplitColumn(nativeRef.current)
    ) {
      console.error(
        '[RNScreens] Stack.Host is rendered in a Split.Column, but it is not the direct and only child of the column, so it is not integrated with the column. Set disableStackIntegration on the Split.Column to nest the stack as plain content.',
      );
      setIsMisplacedInSplitColumn(true);
    }
  }, [isRenderedInSplitColumn]);

  const headlessModeEnabled =
    isRenderedInSplitColumn && !isMisplacedInSplitColumn;

  return (
    <StackHostNativeComponent
      ref={mergedRef}
      style={[
        styles.container,
        directionStyle,
        headlessModeEnabled && styles.headless,
      ]}
      {...restProps}
      headlessModeEnabled={headlessModeEnabled}>
      <SplitColumnMarkerContext.Provider value={headlessModeEnabled}>
        {children}
      </SplitColumnMarkerContext.Provider>
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
