import {
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import React, { useEffect, useState } from 'react';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import type { TabsHostProps } from 'react-native-screens';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';


function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  const [reactForceRtl, setReactForceRtl] = useState(false);
  const [reactAllowRtl, setReactAllowRtl] = useState(true);

  useEffect(() => {
    I18nManager.forceRTL(reactForceRtl);
  }, [reactForceRtl]);

  useEffect(() => {
    I18nManager.allowRTL(reactAllowRtl);
  }, [reactAllowRtl]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text>
          There are 3 sources of layout direction: system, React Native and our
          property on TabsHost.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>System layout direction</Text>
        <Text>
          System layout direction depends on the language of the device
          (Android/iOS) and supportRtl in app manifest (Android) or available
          localizations in Xcode (iOS). In Xcode remember that you must select
          the language as default or provide at least 1 localization file (e.g.
          empty ar.lproj/InfoPlist.strings).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>React Native's isRTL</Text>
        <Text style={styles.rtlInfo}>
          {'I18nManager.isRTL == ' + (I18nManager.isRTL ? 'true' : 'false')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>React Native's forceRTL</Text>
        <Text style={styles.description}>
          Initial value might be incorrect. Remember to restart the app after
          the change!
        </Text>
        <SettingsSwitch
          label={'forceRTL'}
          value={reactForceRtl}
          onValueChange={function (value: boolean): void {
            setReactForceRtl(value);
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>React Native's allowRTL</Text>
        <Text style={styles.description}>
          Initial value might be incorrect. Remember to restart the app after
          the change!
        </Text>
        <SettingsSwitch
          label={'allowRTL'}
          value={reactAllowRtl}
          onValueChange={function (value: boolean): void {
            setReactAllowRtl(value);
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>TabsHost layout direction</Text>
        <SettingsPicker<NonNullable<TabsHostProps['direction']>>
          label={'direction'}
          value={hostConfig.direction ?? 'inherit'}
          onValueChange={value => updateHostConfig({ direction: value })}
          items={['inherit', 'ltr', 'rtl']}
        />
      </View>
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Config',
      safeAreaConfiguration: {
        edges: {
          bottom: true,
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: DummyScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
    },
  },
];

export default function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

App.scenarioDescription = {
  name: 'Layout Direction',
  key: 'test-tabs-tab-bar-layout-direction',
  details:
    'Tests how tabs handle system, React Native and prop layout direction.',
  platforms: ['android', 'ios'],
} as ScenarioDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 60 : undefined,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    marginBottom: 5,
  },
  rtlInfo: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  section: {
    marginBottom: 10,
  },
});
