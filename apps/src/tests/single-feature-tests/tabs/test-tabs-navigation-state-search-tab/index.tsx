import React from 'react';
import { Button, Text } from 'react-native';
import type { TabSelectedEvent } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

// The last `onTabSelected` payload, shared with the tab screens - every
// selection must advance the provenance by exactly one.
const LastSelectionContext = React.createContext<TabSelectedEvent | null>(null);

function formatLastSelection(event: TabSelectedEvent | null) {
  if (event === null) {
    return 'Last selection: none';
  }
  return `Last selection: ${event.selectedScreenKey} (${event.actionOrigin}), provenance: ${event.provenance}`;
}

function ContentView() {
  const { routeKey, isSelected, selectTab } = useTabsNavigationContext();
  const lastSelection = React.useContext(LastSelectionContext);

  return (
    <CenteredLayoutView>
      <Text
        testID={`${routeKey}-route-key-label`}
        style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {routeKey}
      </Text>
      <Text
        testID={`${routeKey}-selected-in-js-label`}
        style={{ textAlign: 'center' }}>
        Selected in JS: {isSelected ? 'yes' : 'no'}
      </Text>
      <Text
        testID={`${routeKey}-last-selection-label`}
        style={{ textAlign: 'center' }}>
        {formatLastSelection(lastSelection)}
      </Text>
      <Button
        testID={`${routeKey}-select-home`}
        title="Select Home (JS)"
        onPress={() => selectTab('Home')}
      />
      <Button
        testID={`${routeKey}-select-search`}
        title="Select Search (JS)"
        onPress={() => selectTab('Search')}
      />
    </CenteredLayoutView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Home',
    Component: ContentView,
    options: {
      title: 'Home',
      tabBarItemTestID: 'home-tab-item',
      ios: {
        icon: { type: 'sfSymbol', name: 'house' },
      },
    },
  },
  {
    name: 'Search',
    Component: ContentView,
    options: {
      tabBarItemTestID: 'search-tab-item',
      ios: {
        systemItem: 'search',
        role: 'search',
      },
    },
  },
];

function TestTabsNavigationStateSearchTab() {
  const [lastSelection, setLastSelection] =
    React.useState<TabSelectedEvent | null>(null);

  return (
    <LastSelectionContext value={lastSelection}>
      <TabsContainer
        routeConfigs={ROUTE_CONFIGS}
        onTabSelected={event => setLastSelection(event.nativeEvent)}
      />
    </LastSelectionContext>
  );
}

export default createScenario(
  TestTabsNavigationStateSearchTab,
  scenarioDescription,
);
