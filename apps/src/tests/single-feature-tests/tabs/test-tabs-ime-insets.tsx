import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Scenario } from '../../shared/helpers';
import { createAutoConfiguredTabs } from '../../shared/tabs';
import React, { useEffect, useState } from 'react';
import { SettingsSwitch } from '../../../shared';
import useTabsConfigState from '../../shared/hooks/tabs-config';
import { DummyScreen } from '../../shared/DummyScreens';

const SCENARIO: Scenario = {
  name: 'IME insets',
  key: 'test-tabs-ime-insets',
  details:
    'Tests prop that determines whether BottomNavigationView respects IME insets.',
  platforms: ['android'],
  AppComponent: App,
};

export default SCENARIO;

type TabsParamList = {
  Config: undefined;
  Tab2: undefined;
};

function ConfigScreen() {
  const [_, dispatch] = useTabsConfigState<TabsParamList>();
  const [tabBarRespectsIMEInsets, setTabBarRespectsIMEInsets] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'tabBar',
      config: {
        tabBarRespectsIMEInsets: tabBarRespectsIMEInsets,
      },
    });
  }, [dispatch, tabBarRespectsIMEInsets]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.heading}>tabBarRespectsIMEInsets</Text>
        <SettingsSwitch
          label={'tabBarRespectsIMEInsets'}
          value={tabBarRespectsIMEInsets}
          onValueChange={function (value: boolean): void {
            setTabBarRespectsIMEInsets(value);
          }}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>TextInput</Text>
        <TextInput
          placeholder="Focus TextInput to show IME..."
          style={styles.textInput}
        />
      </View>
    </ScrollView>
  );
}

const Tabs = createAutoConfiguredTabs<TabsParamList>({
  Config: ConfigScreen,
  Tab2: DummyScreen,
});

export function App() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
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
  section: {
    marginBottom: 10,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});
