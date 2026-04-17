import {
  I18nManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Scenario } from '@apps/tests/shared/helpers';
import React, { useEffect, useState } from 'react';
import { SettingsPicker, SettingsSwitch } from '@apps/shared';
import { Tabs, type TabsHostProps } from 'react-native-screens';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';

const SCENARIO: Scenario = {
  name: 'Layout Direction',
  key: 'test-tabs-tab-bar-layout-direction',
  details:
    'Tests how tabs handle system, React Native and prop layout direction.',
  platforms: ['android', 'ios'],
  AppComponent: App,
};

export default SCENARIO;

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  direction,
  setDirection,
}: {
  direction: NonNullable<TabsHostProps['direction']>;
  setDirection: (value: NonNullable<TabsHostProps['direction']>) => void;
}) {
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
          value={direction}
          onValueChange={value => setDirection(value)}
          items={['inherit', 'ltr', 'rtl']}
        />
      </View>
    </ScrollView>
  );
}

export function App() {
  const [direction, setDirection] = React.useState<
    NonNullable<TabsHostProps['direction']>
  >('inherit');

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Config', provenance: 0 }}
      direction={direction}>
      <Tabs.Screen
        screenKey="Config"
        title="Config"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen direction={direction} setDirection={setDirection} />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="Tab2"
        title="Tab2"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <DummyScreen />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
