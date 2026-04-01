import React from 'react';
import { StyleSheet } from 'react-native';
import { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigNativeComponent from '../../../../fabric/gamma/stack/StackHeaderConfigNativeComponent';
import StackHeaderSubview from './StackHeaderSubview';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfig(props: StackHeaderConfigProps) {
  const {
    backgroundSubview,
    leadingSubview,
    centerSubview,
    trailingSubview,
    ...filteredProps
  } = props;
  return (
    <StackHeaderConfigNativeComponent
      collapsable={false}
      style={StyleSheet.absoluteFill}
      {...filteredProps}>
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
    </StackHeaderConfigNativeComponent>
  );
}

export default StackHeaderConfig;
