import React from 'react';
import TabsBottomAccessoryNativeComponent from '../../fabric/tabs/TabsBottomAccessoryNativeComponent';
import { TabsAccessoryProps } from './TabsAccessory.types';
import { I18nManager, StyleSheet } from 'react-native';
import { isIOS26OrHigher } from '../helpers/PlatformUtils';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsAccessory(props: TabsAccessoryProps) {
  return (
    <TabsBottomAccessoryNativeComponent
      {...props}
      collapsable={false}
      style={[
        props.style,
        StyleSheet.absoluteFill,
        styles.directionFromI18nManagerForIOS26,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // This style is needed on iOS 26+ to bring back valid direction as we're forcing
  // `ltr` in TabsHost to ensure correct TabsBottomAccessory layout.
  directionFromI18nManagerForIOS26: {
    direction: isIOS26OrHigher
      ? I18nManager.isRTL
        ? 'rtl'
        : 'ltr'
      : undefined,
  },
});
