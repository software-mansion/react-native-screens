import React, { useState } from 'react';
import {
  TabsContainer,
  TabRouteConfig,
} from '@apps/shared/gamma/containers/tabs';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '@apps/shared/gamma/containers/tabs/ConfigWrapperContext';
import ConfigColumnTab from './ConfigColumnTab';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function ConfigColumn({
  configColumnIndex,
}: {
  configColumnIndex: 1 | 2 | 3 | 4;
}) {
  const TAB_CONFIGS: TabRouteConfig[] = ([1, 2, 3, 4] as (1 | 2 | 3 | 4)[])
    .filter(index => index !== configColumnIndex)
    .map(index => {
      const configuration: TabRouteConfig = {
        name: 'column' + index,
        Component: () => ConfigColumnTab({ index, configColumnIndex }),
        options: {
          title: 'Column ' + index,
          ios: {
            icon: {
              type: 'sfSymbol',
              name: index + '.circle',
            },
          },
        },
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
        <TabsContainer routeConfigs={TAB_CONFIGS} />
      </ConfigWrapperContext.Provider>
    </SafeAreaView>
  );
}
