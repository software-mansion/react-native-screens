import React from 'react';
import { type ViewProps, View, Text, Button } from 'react-native';
import ConfigWrapperContext from '@apps/shared/gamma/containers/tabs/ConfigWrapperContext';
import { someExtensiveComputation } from '../utils';
import { TabConfigurationSummary } from './TabConfigurationSummary';

export interface TabContentViewProps extends ViewProps {
  selectNextTab?: (() => void) | undefined;
  screenKey: string;
  message?: string;
}

export function TabContentView(props: TabContentViewProps) {
  const { selectNextTab, screenKey, message, ...viewProps } = props;

  const configWrapper = React.useContext(ConfigWrapperContext);

  console.log(
    `TabContentView render with config: ${JSON.stringify(
      configWrapper.config,
    )}`,
  );

  if (configWrapper.config.heavyTabRender) {
    someExtensiveComputation();
  }

  return (
    <View {...viewProps}>
      {message !== undefined && <Text>{message}</Text>}
      <TabConfigurationSummary screenKey={screenKey} />
      <Button title="Next tab" onPress={selectNextTab} />
      <Button
        title="Toggle heavy render"
        onPress={() => {
          configWrapper.setConfig?.(prev => {
            return {
              ...prev,
              heavyTabRender: !prev.heavyTabRender,
            };
          });
        }}
      />
    </View>
  );
}
