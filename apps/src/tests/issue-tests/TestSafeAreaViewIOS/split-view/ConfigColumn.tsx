import React, { useState } from 'react';
import {
  TabsContainer,
  TabConfiguration,
} from '../../../../shared/gamma/containers/tabs/TabsContainer';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../../../shared/gamma/containers/tabs/ConfigWrapperContext';
import ConfigColumnTab from './ConfigColumnTab';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function ConfigColumn({
  configColumnIndex,
}: {
  configColumnIndex: 1 | 2 | 3 | 4;
}) {
  const TAB_CONFIGS: TabConfiguration[] = ([1, 2, 3, 4] as (1 | 2 | 3 | 4)[])
    .filter(index => index !== configColumnIndex)
    .map(index => {
      const configuration: TabConfiguration = {
        screenProps: {
          screenKey: 'column' + index,
          title: 'Column ' + index,
          ios: {
            icon: {
              type: 'sfSymbol',
              name: index + '.circle',
            },
          },
        },
        component: () => ConfigColumnTab({ index, configColumnIndex }),
      };

      return configuration;
    });

  const [tabsConfig, setTabsConfig] = useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  return (
    <SafeAreaView edges={{ left: true, right: true }}>
      <ConfigWrapperContext.Provider
        value={{
          config: tabsConfig,
          setConfig: setTabsConfig,
        }}>
        <TabsContainer tabConfigs={TAB_CONFIGS} />
      </ConfigWrapperContext.Provider>
    </SafeAreaView>
  );
}
