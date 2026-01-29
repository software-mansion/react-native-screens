import React from 'react';
import { Text } from 'react-native';
import ConfigWrapperContext from '../../../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';

export interface TabConfigurationSummaryProps {
  tabKey: string;
}

export function TabConfigurationSummary(props: TabConfigurationSummaryProps) {
  const configWrapper = React.useContext(ConfigWrapperContext);

  return (
    <>
      <Text>tabKey: {props.tabKey}</Text>
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
