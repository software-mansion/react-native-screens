'use client';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  type NativeSyntheticEvent,
} from 'react-native';
import BottomTabsNativeComponent, {
  type NativeProps as BottomTabsNativeComponentProps,
} from '../../fabric/bottom-tabs/BottomTabsNativeComponent';
import featureFlags from '../../flags';
import type {
  BottomTabsProps,
  NativeFocusChangeEvent,
} from './BottomTabs.types';
import { bottomTabsDebugLog } from '../../private/logging';
import BottomTabsAccessory from './BottomTabsAccessory';
import PressableWithFeedback from '../../../apps/src/shared/PressableWithFeedback';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function BottomTabs(props: BottomTabsProps) {
  bottomTabsDebugLog(`BottomTabs render`);

  const {
    onNativeFocusChange,
    experimentalControlNavigationStateInJS = featureFlags.experiment
      .controlledBottomTabs,
    ...filteredProps
  } = props;

  const componentNodeRef =
    React.useRef<React.Component<BottomTabsNativeComponentProps>>(null);
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    } else {
      componentNodeHandle.current = -1;
    }
  }, []);

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      bottomTabsDebugLog(
        `BottomTabs [${
          componentNodeHandle.current ?? -1
        }] onNativeFocusChange: ${JSON.stringify(event.nativeEvent)}`,
      );
      onNativeFocusChange?.(event);
    },
    [onNativeFocusChange],
  );

  return (
    <BottomTabsNativeComponent
      style={styles.fillParent}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={experimentalControlNavigationStateInJS}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredProps}>
      {filteredProps.children}
      <BottomTabsAccessory>
        <View
          collapsable={false}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'yellow',
          }}>
          <PressableWithFeedback>
            <Text
              style={
                {
                  // backgroundColor: 'green',
                }
              }>
              Hello, World!
            </Text>
          </PressableWithFeedback>
        </View>
      </BottomTabsAccessory>
    </BottomTabsNativeComponent>
  );
}

export default BottomTabs;

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
