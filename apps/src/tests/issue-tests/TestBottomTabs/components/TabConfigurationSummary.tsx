import React from 'react';
import { Text } from 'react-native';
import ConfigWrapperContext from '../../../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';

export interface TabConfigurationSummaryProps {
  screenKey: string;
}

export function TabConfigurationSummary(props: TabConfigurationSummaryProps) {
  const configWrapper = React.useContext(ConfigWrapperContext);

  return (
    <>
      <Text>screenKey: {props.screenKey}</Text>
      <Text>
        heavyTabRender: {configWrapper.config.heavyTabRender ? 'true' : 'false'}
      </Text>
      <Text>
        controlledBottomTabs:{' '}
        {configWrapper.config.controlledBottomTabs ? 'true' : 'false'}
      </Text>
    </>
  );
}
