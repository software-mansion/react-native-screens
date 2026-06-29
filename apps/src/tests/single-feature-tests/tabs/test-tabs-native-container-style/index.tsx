import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  type ColorValue,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
type ContainerBackgroundOption = 'unset' | 'blue' | 'yellow' | 'purple';

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  const getBackgroundColor = (
    option: ContainerBackgroundOption,
  ): ColorValue | undefined => {
    switch (option) {
      case 'blue':
        return Colors.BlueLight100;
      case 'yellow':
        return Colors.YellowLight100;
      case 'purple':
        return Colors.PurpleLight100;
      case 'unset':
      default:
        return undefined;
    }
  };

  const currentOption = (() => {
    const bgColor = hostConfig.nativeContainerStyle?.backgroundColor;
    if (bgColor === Colors.BlueLight100) return 'blue';
    if (bgColor === Colors.YellowLight100) return 'yellow';
    if (bgColor === Colors.PurpleLight100) return 'purple';
    return 'unset';
  })();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.heading}>nativeContainerStyle</Text>
        <Text style={styles.description}>
          Controls the background color of the native container.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          {'•'} On <Text style={{ fontWeight: '600' }}>Android</Text>: Color is
          applied to the FrameLayout that wraps the focused screen and
          BottomNavigationView
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          {'•'} On <Text style={{ fontWeight: '600' }}>iOS</Text>: Color is
          applied to the UITabBarController's view
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Background Color</Text>
        <SettingsPicker<ContainerBackgroundOption>
          label="backgroundColor"
          value={currentOption}
          onValueChange={option => {
            updateHostConfig({
              nativeContainerStyle: {
                backgroundColor: getBackgroundColor(option),
              },
            });
          }}
          items={['unset', 'blue', 'yellow', 'purple']}
        />
      </View>
    </ScrollView>
  );
}

function TabScreen() {
  return (
    <View style={styles.centeredContent}>
      <Text style={styles.contentLabel}>Transparent Tab</Text>
      <Text style={styles.contentHint}>
        Observe the container background color behind the tab content and within
        the tab bar area.
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Config',
      ios: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.ios,
        scrollEdgeAppearance: {
          tabBarBackgroundColor: Colors.RedDark100,
        },
        standardAppearance: {
          tabBarBackgroundColor: Colors.RedDark100,
        },
      },
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarBackgroundColor: Colors.RedDark100,
          tabBarItemActiveIndicatorEnabled: false,
        },
      },
    },
  },
  {
    name: 'Transparent',
    Component: TabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Transparent',
      android: {
        ...DEFAULT_TAB_ROUTE_OPTIONS.android,
        standardAppearance: {
          tabBarBackgroundColor: 'transparent',
          tabBarItemActiveIndicatorEnabled: false,
        },
      },
    },
  },
];

function TestTabsNativeContainerStyle() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.OffNavy,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.LightOffNavy,
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    lineHeight: 20,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  contentLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.OffNavy,
    textAlign: 'center',
  },
  contentHint: {
    fontSize: 13,
    color: Colors.LightOffNavy,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default createScenario(
  TestTabsNativeContainerStyle,
  scenarioDescription,
);
