import React from 'react';
import { ScrollView, View } from 'react-native';
import { Tabs, type TabsHostNavStateRequest } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const ROUTES = [
  {
    key: 'First',
    render: () => (
      <View style={{ flex: 1, backgroundColor: 'rebeccapurple' }} />
    ),
  },
  {
    key: 'Second',
    render: () => (
      <ScrollView
        style={{ backgroundColor: 'papayawhip' }}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: 1000 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: '50%',
              aspectRatio: 1,
              paddingVertical: 5,
              paddingLeft: i % 2 === 0 ? 10 : 5,
              paddingRight: i % 2 === 0 ? 5 : 10,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: `tomato`,
                borderCurve: 'continuous',
                borderRadius: 10,
              }}
            />
          </View>
        ))}
      </ScrollView>
    ),
  },
  {
    key: 'Third',
    render: () => (
      <ScrollView style={{ backgroundColor: 'royalblue' }}>
        {Array.from({ length: 1000 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 80,
              backgroundColor: i % 2 === 0 ? 'royalblue' : 'lightblue',
            }}
          />
        ))}
      </ScrollView>
    ),
  },
];

function TestTabsLazyRendering() {
  const [state, setState] = React.useState<{
    request: TabsHostNavStateRequest;
    mounted: string[];
  }>({
    request: { selectedScreenKey: 'First', baseProvenance: 0 },
    mounted: ['First'],
  });

  return (
    <Tabs.Host
      navStateRequest={state.request}
      onTabSelected={({ nativeEvent }) => {
        const { selectedScreenKey, provenance } = nativeEvent;

        setState(previous => ({
          request: { selectedScreenKey, baseProvenance: provenance },
          mounted: previous.mounted.includes(selectedScreenKey)
            ? previous.mounted
            : [...previous.mounted, selectedScreenKey],
        }));
      }}>
      {ROUTES.map(route => (
        <Tabs.Screen
          key={route.key}
          screenKey={route.key}
          title={route.key}
          deferTransitionUntilFirstStateUpdate>
          {state.mounted.includes(route.key) ? route.render() : null}
        </Tabs.Screen>
      ))}
    </Tabs.Host>
  );
}

export default createScenario(TestTabsLazyRendering, scenarioDescription);
