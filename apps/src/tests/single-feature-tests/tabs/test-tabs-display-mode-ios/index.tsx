import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import type {
  TabsScreenAppearanceIOS,
  TabBarControllerMode,
} from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Display Mode Appearance (iOS)',
  key: 'test-tabs-display-mode-ios',
  details:
    'Exercises per-display-mode tab bar item appearance via stacked, ' +
    'inline, and compactInline buckets on TabsScreenAppearanceIOS. ' +
    'Uses tabBarItemTitleFontColor as the discriminator: red family ' +
    'for stacked, blue family for inline, green family for compactInline.',
  platforms: ['ios'],
};

/**
 * Appearance applied when tab bar items are in STACKED layout
 * (icon above title — default on iPhone portrait).
 * Normal titles: RedLight100. Selected title: RedDark110.
 */
const STACKED_APPEARANCE: TabsScreenAppearanceIOS = {
  stacked: {
    normal: {
      tabBarItemTitleFontColor: Colors.RedLight100,
    },
    selected: {
      tabBarItemTitleFontColor: Colors.RedDark110,
    },
  },
  inline: {
    normal: {
      tabBarItemTitleFontColor: Colors.BlueLight100,
    },
    selected: {
      tabBarItemTitleFontColor: Colors.BlueDark120,
    },
  },
  compactInline: {
    normal: {
      tabBarItemTitleFontColor: Colors.GreenLight100,
    },
    selected: {
      tabBarItemTitleFontColor: Colors.GreenDark120,
    },
  },
};

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.section}>
        <Text style={styles.heading}>About this scenario</Text>
        <Text style={styles.description}>
          All three content tabs share the same{' '}
          <Text style={styles.code}>standardAppearance</Text> with all three
          display-mode buckets configured:{'\n\n'}
          {'  '}
          <Text style={styles.redSwatch}>stacked</Text>
          {' → Red tab titles (normal: RedLight100, selected: RedDark110)\n'}
          {'  '}
          <Text style={styles.blueSwatch}>inline</Text>
          {' → Blue tab titles (normal: BlueLight100, selected: BlueDark120)\n'}
          {'  '}
          <Text style={styles.greenSwatch}>compactInline</Text>
          {
            ' → Green tab titles (normal: GreenLight100, selected: GreenDark120)\n\n'
          }
          Read the title color to identify which display mode iOS chose, and
          which tab is selected.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Force display mode</Text>
        <Text style={styles.description}>
          <Text style={styles.code}>tabBarControllerMode</Text> on the host.
          Use <Text style={styles.code}>tabBar</Text> to force the bottom tab
          bar (stacked on iPhone portrait, inline/compactInline in landscape on
          wide devices). Use <Text style={styles.code}>tabSidebar</Text> on iPad
          to get the sidebar — item layout then follows the size class.
        </Text>
        <SettingsPicker<TabBarControllerMode>
          label="tabBarControllerMode"
          value={hostConfig.ios?.tabBarControllerMode ?? 'automatic'}
          onValueChange={value =>
            updateHostConfig({ ios: { tabBarControllerMode: value } })
          }
          items={['automatic', 'tabBar', 'tabSidebar']}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>How to trigger each mode</Text>
        <Text style={styles.description}>
          <Text style={styles.bold}>stacked:</Text>
          {
            ' iPhone (any) in portrait — icon above title, red titles.\n\n'
          }
          <Text style={styles.bold}>inline:</Text>
          {
            ' iPhone Pro Max / iPad in landscape (regular width) — icon next to title, blue titles.\n\n'
          }
          <Text style={styles.bold}>compactInline:</Text>
          {
            ' iPhone Pro (non-Max) in landscape (compact width) — icon next to title, green titles.'
          }
        </Text>
      </View>
    </ScrollView>
  );
}

function TabScreen({ name }: { name: string }) {
  return (
    <CenteredLayoutView>
      <Text style={styles.tabScreenLabel}>{name}</Text>
      <Text style={styles.tabScreenHint}>
        Check the tab bar below — title color indicates the active display mode:
      </Text>
      <Text style={[styles.tabScreenHint, styles.redSwatch]}>
        Red = stacked
      </Text>
      <Text style={[styles.tabScreenHint, styles.blueSwatch]}>
        Blue = inline
      </Text>
      <Text style={[styles.tabScreenHint, styles.greenSwatch]}>
        Green = compactInline
      </Text>
    </CenteredLayoutView>
  );
}

function Tab1Screen() {
  return <TabScreen name="Tab 1" />;
}

function Tab2Screen() {
  return <TabScreen name="Tab 2" />;
}

function Tab3Screen() {
  return <TabScreen name="Tab 3" />;
}

const SHARED_IOS_OPTIONS = {
  ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
  standardAppearance: STACKED_APPEARANCE,
  scrollEdgeAppearance: STACKED_APPEARANCE,
};

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    Component: ConfigScreen,
    options: {
      title: 'Config',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        icon: { type: 'sfSymbol', name: 'gearshape.fill' },
        standardAppearance: STACKED_APPEARANCE,
        scrollEdgeAppearance: STACKED_APPEARANCE,
      },
    },
  },
  {
    name: 'Tab1',
    Component: Tab1Screen,
    options: {
      title: 'Tab1',
      ios: {
        ...SHARED_IOS_OPTIONS,
        icon: { type: 'sfSymbol', name: 'house.fill' },
      },
    },
  },
  {
    name: 'Tab2',
    Component: Tab2Screen,
    options: {
      title: 'Tab2',
      ios: {
        ...SHARED_IOS_OPTIONS,
        icon: { type: 'sfSymbol', name: 'star.fill' },
      },
    },
  },
  {
    name: 'Tab3',
    Component: Tab3Screen,
    options: {
      title: 'Tab3',
      ios: {
        ...SHARED_IOS_OPTIONS,
        icon: { type: 'sfSymbol', name: 'heart.fill' },
      },
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  code: {
    fontFamily: 'Courier',
    fontSize: 13,
    color: '#333',
  },
  bold: {
    fontWeight: '700',
  },
  redSwatch: {
    color: Colors.RedLight100,
    fontWeight: '600',
  },
  blueSwatch: {
    color: Colors.BlueLight100,
    fontWeight: '600',
  },
  greenSwatch: {
    color: Colors.GreenLight100,
    fontWeight: '600',
  },
  tabScreenLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabScreenHint: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default createScenario(App, scenarioDescription);
