'use client';

import React from 'react';
import { StyleSheet } from 'react-native';
import TabsHostIOSNativeComponent, {
  type NativeProps as TabsHostIOSNativeComponentProps,
} from '../../../fabric/tabs/TabsHostIOSNativeComponent';
import type { TabsHostProps } from './TabsHost.types';
import { RNSLog } from '../../../private';
import TabsBottomAccessory from '../bottom-accessory/TabsBottomAccessory';
import TabsBottomAccessoryContent from '../bottom-accessory/TabsBottomAccessoryContent';
import { isIOS26OrHigher } from '../../helpers/PlatformUtils';
import { useTabsHost } from './useTabsHost';

function TabsHost(props: TabsHostProps) {
  RNSLog.log(`TabsHost render`);

  // android props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ios, android, ...baseProps } = props;

  const {
    children,
    direction,
    nativeContainerStyle,
    onTabSelected,
    navStateRequest,
    ...filteredBaseProps
  } = baseProps;

  const componentNodeRef =
    React.useRef<React.Component<TabsHostIOSNativeComponentProps>>(null);

  const { onTabSelected: onTabSelectedCallback } =
    useTabsHost<TabsHostIOSNativeComponentProps>({
      componentNodeRef,
      onTabSelected,
    });

  return (
    <TabsHostIOSNativeComponent
      style={styles.fillParent}
      navStateRequest={navStateRequest}
      onTabSelected={onTabSelectedCallback}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredBaseProps}
      // iOS-specific
      layoutDirection={direction}
      tabBarControllerMode={ios?.tabBarControllerMode}
      tabBarMinimizeBehavior={ios?.tabBarMinimizeBehavior}
      tabBarTintColor={ios?.tabBarTintColor}
      bottomAccessoryHidden={ios?.bottomAccessoryHidden}
      onMoreTabSelected={ios?.onMoreTabSelected}>
      {children}
      {ios?.bottomAccessory && isIOS26OrHigher && (
        <TabsBottomAccessory>
          <TabsBottomAccessoryContent environment="regular">
            {ios.bottomAccessory('regular')}
          </TabsBottomAccessoryContent>
          <TabsBottomAccessoryContent environment="inline">
            {ios.bottomAccessory('inline')}
          </TabsBottomAccessoryContent>
        </TabsBottomAccessory>
      )}
    </TabsHostIOSNativeComponent>
  );
}

export default TabsHost;

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
