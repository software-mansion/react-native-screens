import React from 'react';
import { type ViewProps, View, Text, Button } from 'react-native';
import ConfigWrapperContext from '../../../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import { someExtensiveComputation } from '../utils';
import { TabConfigurationSummary } from './TabConfigurationSummary';

export interface TabContentViewProps extends ViewProps {
  selectNextTab?: (() => void) | undefined;
  tabKey: string;
  message?: string;
}

export function TabContentView(props: TabContentViewProps) {
  const { selectNextTab, tabKey, message, ...viewProps } = props;

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
      <TabConfigurationSummary tabKey={tabKey} />
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
