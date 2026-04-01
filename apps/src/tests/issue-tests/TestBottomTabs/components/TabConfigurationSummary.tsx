import React from 'react';
import { Text } from 'react-native';
import ConfigWrapperContext from '@apps/shared/gamma/containers/tabs/ConfigWrapperContext';

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
    </>
  );
}
