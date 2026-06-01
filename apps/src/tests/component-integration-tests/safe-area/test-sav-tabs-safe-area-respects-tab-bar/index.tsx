import React from "react";
import { scenarioDescription } from "./scenario-description";
import { createScenario } from "@apps/tests/shared/helpers";
import { StyleSheet, View, ViewProps } from "react-native";
import { DEFAULT_TAB_ROUTE_OPTIONS, TabRouteConfig, TabsContainer } from "@apps/shared/gamma/containers/tabs";
import { Colors } from "@apps/shared/styling";
import { SafeAreaView } from "react-native-screens/experimental";
import { SafeAreaConfigContext, SafeAreaConfigurationButtons, SafeAreaMarkers, useSafeAreaConfig, useSafeAreaInitialConfig } from "@apps/tests/shared/components/safe-area-view";

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'tab-1',
    Component: TabContents,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab 1',
    },
  },
  {
    name: 'tab-2',
    Component: TabContents,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab 2',
    },
  },
  {
    name: 'tab-3',
    Component: TabContents,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab 3',
    },
  }
]

export function TestSavTabsSafeAreaRespectsTabBar() {
  return (
    <TabsContainer routeConfigs={ROUTE_CONFIGS} ios={{ tabBarControllerMode: 'tabSidebar' }} />
  );
}

function TabContents() {
  const safeAreaConfig = useSafeAreaInitialConfig({
    isTopEnabled: true,
    isBottomEnabled: true,
  });

  return (
    <BackgroundView>
      <SafeAreaConfigContext value={safeAreaConfig}>
        <TabContentsInner />
      </SafeAreaConfigContext>
    </BackgroundView>
  );
}

function BackgroundView(props: ViewProps) {
  return (
    <View {...props} style={[styles.flexContainer]} />
  );
}

function TabContentsInner() {
  const { props: safeAreaConfig } = useSafeAreaConfig();

  return (
    <View style={[styles.flexContainer]}>
      <SafeAreaView style={[styles.flexContainer, { backgroundColor: Colors.GreenLight60 }]} {...safeAreaConfig}>
        <View style={[styles.flexContainer, styles.centeredContainer]}>
          <SafeAreaConfigurationButtons />
        </View>
        <SafeAreaMarkers />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});


export default createScenario(TestSavTabsSafeAreaRespectsTabBar, scenarioDescription);
