import React from 'react';
import { PlatformColor, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { createScenario } from '@apps/tests/shared/helpers';
import scenarioDescription from './scenario-description';
import type { TabsScreenAppearanceIOS } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';


const APPEARANCE: TabsScreenAppearanceIOS = {
  stacked: {
    normal: {
      tabBarItemTitleFontColor: Colors.RedDark120,
    },
    selected: {
      tabBarItemTitleFontColor: Colors.RedLight100,
      tabBarItemTitleFontStyle: 'italic',
    },
  },
  inline: {
    normal: {
      tabBarItemTitleFontColor: Colors.BlueDark120,
    },
    selected: {
      tabBarItemTitleFontColor: Colors.BlueLight100,
      tabBarItemTitleFontStyle: 'italic',
    },
  },
  compactInline: {
    normal: {
      tabBarItemTitleFontColor: Colors.GreenDark120,
    },
    selected: {
      tabBarItemTitleFontColor: Colors.GreenLight100,
      tabBarItemTitleFontStyle: 'italic',
    },
  },
};

function InfoScreen() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.section}>
        <Text style={styles.description}>
          Font color identifies the active bucket — read the tab bar label
          color to confirm which layout mode iOS chose:
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Color legend</Text>
        <Text style={[styles.description, styles.redSwatch]}>
          Red = stacked (iPhone portrait)
        </Text>
        <Text style={[styles.description, styles.blueSwatch]}>
          Blue = inline (iPhone Pro Max in landscape)
        </Text>
        <Text style={[styles.description, styles.greenSwatch]}>
          Green = compactInline (iPhone Pro in landscape)
        </Text>
        <Text style={[styles.description, { marginTop: 8 }]}>
          In each case the{' '}
          <Text style={styles.bold}>selected tab title is italic</Text> and the tab icon color is system default:{' '}
          <Text style={{ color: PlatformColor('systemBlue') }}>blue</Text>;{'\n\n'}
          The unselected tab titles font and icons color follows system default values: a normal font and gray or black colors. On iOS 18, the tab item label color is set to a darker shade of the bucket color while on iOS 26 it follows the system default.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>iOS version notes</Text>
        <Text style={styles.description}>
          <Text style={styles.bold}>iOS 18:</Text> All three buckets —{' '}
          <Text style={styles.code}>stacked</Text>,{' '}
          <Text style={styles.code}>inline</Text>, and{' '}
          <Text style={styles.code}>compactInline</Text> — are applicable.
          {'\n\n'}
          <Text style={styles.bold}>iOS 26:</Text> The{' '}
          <Text style={styles.code}>inline</Text> bucket is not applied.{' '}
          <Text style={styles.code}>stacked</Text> and{' '}
          <Text style={styles.code}>compactInline</Text> are honored. Expect that blue titles will never appear on iPhones running iOS 26.
          {'\n\n'}
        </Text>
      </View>
    </ScrollView>
  );
}

function TabScreen({ name }: { name: string }) {
  return (
    <CenteredLayoutView>
      <Text style={styles.tabLabel}>{name}</Text>
      <Text style={styles.tabHint}>
        Selected title: <Text style={styles.bold}>italic</Text>
        {'\n'}
        Unselected titles: upright (normal)
        {'\n\n'}
        <Text style={styles.redSwatch}>Red = stacked</Text>
        {'\n'}
        <Text style={styles.blueSwatch}>Blue = inline</Text>
        {'\n'}
        <Text style={styles.greenSwatch}>Green = compactInline</Text>
        {'\n\n'}
        <Text style={styles.note}>
          iOS 26: inline bucket is not applied; blue titles will not appear.
        </Text>
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
  standardAppearance: APPEARANCE,
  scrollEdgeAppearance: APPEARANCE,
};

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Info',
    Component: InfoScreen,
    options: {
      title: 'Info',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        icon: { type: 'sfSymbol', name: 'info.circle.fill' },
        standardAppearance: APPEARANCE,
        scrollEdgeAppearance: APPEARANCE,
      },
    },
  },
  {
    name: 'Tab1',
    Component: Tab1Screen,
    options: {
      title: 'Tab1',
      tabBarItemTestID: 'tab-item-title-style-tab1',
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
      tabBarItemTestID: 'tab-item-title-style-tab2',
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
      tabBarItemTestID: 'tab-item-title-style-tab3',
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
  note: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
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
  tabLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabHint: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default createScenario(App, scenarioDescription);
