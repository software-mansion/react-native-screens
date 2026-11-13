import React from 'react';
import { StyleSheet } from 'react-native';
import SplitScreenNativeComponent from '../../fabric/split/SplitScreenNativeComponent';
import SplitColumnMarkerContext from './SplitColumnMarkerContext';
import type {
  SplitColumnProps,
  SplitInspectorProps,
} from './SplitScreen.types';

function Column(props: SplitColumnProps) {
  const { children, disableStackIntegration = false, ...restProps } = props;

  // The integration with a stack is configured once, when the column is
  // mounted. `Stack.Host` and `Stack.Screen` read it from the context.
  const [isStackIntegrationDisabled] = React.useState(disableStackIntegration);

  React.useEffect(() => {
    if (disableStackIntegration !== isStackIntegrationDisabled) {
      console.warn(
        '[RNScreens] `disableStackIntegration` of Split.Column cannot be changed after the column is mounted. The change is ignored.',
      );
    }
  }, [disableStackIntegration, isStackIntegrationDisabled]);

  return (
    <SplitScreenNativeComponent
      columnType="column"
      {...restProps}
      style={StyleSheet.absoluteFill}>
      <SplitColumnMarkerContext.Provider value={!isStackIntegrationDisabled}>
        {children}
      </SplitColumnMarkerContext.Provider>
    </SplitScreenNativeComponent>
  );
}

function Inspector(props: SplitInspectorProps) {
  return (
    <SplitScreenNativeComponent
      columnType="inspector"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitScreenNativeComponent>
  );
}

// TODO: refactor to drop `Screen` suffix as the API name is really long at the moment
const SplitScreen = {
  Column,
  Inspector,
};

export default SplitScreen;
