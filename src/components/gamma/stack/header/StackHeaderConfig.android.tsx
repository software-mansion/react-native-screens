import React from 'react';
import { StyleSheet } from 'react-native';
import { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigAndroidNativeComponent from '../../../../fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent';
import StackHeaderSubview from './android/StackHeaderSubview.android';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfig(props: StackHeaderConfigProps) {
  // ios props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { android, ios, ...baseProps } = props;

  const {
    backgroundSubview,
    leadingSubview,
    centerSubview,
    trailingSubview,
    ...filteredAndroidProps
  } = android ?? {};

  return (
    <StackHeaderConfigAndroidNativeComponent
      collapsable={false}
      style={StyleSheet.absoluteFill}
      {...baseProps}
      {...filteredAndroidProps}>
      {backgroundSubview && (
        <StackHeaderSubview
          type="background"
          collapseMode={backgroundSubview.collapseMode}>
          {backgroundSubview.Component}
        </StackHeaderSubview>
      )}
      {leadingSubview && (
        <StackHeaderSubview type="leading">
          {leadingSubview.Component}
        </StackHeaderSubview>
      )}
      {centerSubview && (
        <StackHeaderSubview type="center">
          {centerSubview.Component}
        </StackHeaderSubview>
      )}
      {trailingSubview && (
        <StackHeaderSubview type="trailing">
          {trailingSubview.Component}
        </StackHeaderSubview>
      )}
    </StackHeaderConfigAndroidNativeComponent>
  );
}

export default StackHeaderConfig;
