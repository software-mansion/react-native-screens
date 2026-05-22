import React from "react";
import { createScenario } from "@apps/tests/shared/helpers";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-screens/experimental";
import { Colors } from "@apps/shared/styling";
import { scenarioDescription } from "./scenario-description";
import {
  SafeAreaConfigContext,
  SafeAreaConfigurationButtons,
  SafeAreaMarkers,
  useSafeAreaConfig,
  useSafeAreaInitialConfig
} from "@apps/tests/shared/components/safe-area-view";

export function TestSAVRespectsWindowInsets() {
  const contextPayload = useSafeAreaInitialConfig();
  return (
    <SafeAreaConfigContext value={contextPayload}>
      <ContentsView />
    </SafeAreaConfigContext>

  );
}

export function ContentsView() {
  const { props: safeAreaConfig } = useSafeAreaConfig();

  return (
    <View style={[styles.flexContainer, { backgroundColor: Colors.NavyLight10 }]}>
      <SafeAreaView style={{ backgroundColor: Colors.GreenLight80 }} {...safeAreaConfig} >
        <View style={[styles.flexContainer, styles.centered, styles.fillingContainer]}>
          <SafeAreaConfigurationButtons />
        </View>
        <SafeAreaMarkers />
      </SafeAreaView>
    </View>
  );
}

export default createScenario(TestSAVRespectsWindowInsets, scenarioDescription);


const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  fillingContainer: {
    height: '100%',
    width: '100%',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
