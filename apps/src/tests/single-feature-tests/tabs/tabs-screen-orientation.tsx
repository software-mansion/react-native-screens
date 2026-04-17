import { SettingsPicker } from '@apps/shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { Scenario } from '@apps/tests/shared/helpers';
import { Tabs, type TabsScreenOrientation } from 'react-native-screens';

const SCENARIO: Scenario = {
  name: 'Tabs Screen Orientation',
  key: 'tabs-screen-orientation',
  AppComponent: App,
  platforms: ['ios', 'android'],
};

export default SCENARIO;

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  orientation,
  setOrientation,
}: {
  orientation: TabsScreenOrientation | undefined;
  setOrientation: (value: TabsScreenOrientation | undefined) => void;
}) {
  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={orientation ?? 'undefined'}
        onValueChange={value =>
          setOrientation(value === 'undefined' ? undefined : value)
        }
      />
    </ScrollView>
  );
}

export function App() {
  const [orientation, setOrientation] = React.useState<
    TabsScreenOrientation | undefined
  >(undefined);

  return (
    <Tabs.Host navState={{ selectedScreenKey: 'Tab1', provenance: 0 }}>
      <Tabs.Screen
        screenKey="Tab1"
        title="Tab1"
        orientation={orientation}
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen
          orientation={orientation}
          setOrientation={setOrientation}
        />
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
