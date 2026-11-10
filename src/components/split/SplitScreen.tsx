import React from 'react';
import { StyleSheet } from 'react-native';
import SplitScreenNativeComponent from '../../fabric/split/SplitScreenNativeComponent';
import SplitColumnMarkerContext from './SplitColumnMarkerContext';
import { SplitScreenProps } from './SplitScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * A column whose only direct child is a `Stack.Host` is navigated by that stack on
 * iOS. The host's navigation controller takes the column, the column's
 * appearance events come from it, and the column takes no part in layout, so
 * its `onLayout` and `measure` report an empty frame. `disableStackIntegration`
 * opts out of this and keeps the column a plain one.
 */
function Column(props: SplitScreenProps) {
  return (
    <SplitScreenNativeComponent
      columnType="column"
      {...props}
      style={StyleSheet.absoluteFill}>
      <SplitColumnMarkerContext.Provider
        value={props.disableStackIntegration !== true}>
        {props.children}
      </SplitColumnMarkerContext.Provider>
    </SplitScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Inspector(props: SplitScreenProps) {
  return (
    <SplitScreenNativeComponent
      columnType="inspector"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
// TODO: refactor to drop `Screen` suffix as the API name is really long at the moment
const SplitScreen = {
  Column,
  Inspector,
};

export default SplitScreen;
