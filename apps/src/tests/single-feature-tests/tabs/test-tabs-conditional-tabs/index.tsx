import React from 'react';
import { Button, Text, View } from 'react-native';
import { Tabs } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { DEFAULT_TAB_ROUTE_OPTIONS } from '@apps/shared/containers/tabs';

const EXTRA_TAB_KEYS = ['Tab2', 'Tab3', 'Tab4'];

function TestTabsConditionalTabs() {
  const [showExtraTabs, setShowExtraTabs] = React.useState(true);
  const [toggleCount, setToggleCount] = React.useState(0);

  const toggle = () => {
    setShowExtraTabs(value => !value);
    setToggleCount(count => count + 1);
  };

  return (
    <Tabs.Host
      navStateRequest={{ selectedScreenKey: 'Tab1', baseProvenance: 0 }}
      tabBarHidden={!showExtraTabs}>
      <Tabs.Screen {...DEFAULT_TAB_ROUTE_OPTIONS} screenKey="Tab1" title="Tab1">
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Extra tabs: {showExtraTabs ? 'shown' : 'hidden'}</Text>
          <Text>Toggles: {toggleCount}</Text>
          <Button
            title={showExtraTabs ? 'Hide extra tabs' : 'Show extra tabs'}
            onPress={toggle}
            testID="conditional-tabs-toggle"
          />
        </View>
      </Tabs.Screen>
      {showExtraTabs &&
        EXTRA_TAB_KEYS.map(key => (
          <Tabs.Screen
            {...DEFAULT_TAB_ROUTE_OPTIONS}
            key={key}
            screenKey={key}
            title={key}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>{key}</Text>
            </View>
          </Tabs.Screen>
        ))}
    </Tabs.Host>
  );
}

export default createScenario(TestTabsConditionalTabs, scenarioDescription);
