import React, { Dispatch, SetStateAction } from "react";
import { createScenario, type ScenarioDescription } from "@apps/tests/shared/helpers";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, SafeAreaViewProps } from "react-native-screens/experimental";
import { Colors } from "@apps/shared/styling";

const scenarioDescription: ScenarioDescription = {
  name: 'SaveAreaView and window insets',
  key: 'test-sav-respects-window-insets',
  details: 'SafeAreaView should allow avoiding window insets',
  platforms: ['android', 'ios'],
};

type SafeAreaConfigContextPayload = {
  props: SafeAreaViewProps;
  mutations: {
    toggleLeft: Dispatch<SetStateAction<boolean>>;
    toggleTop: Dispatch<SetStateAction<boolean>>;
    toggleRight: Dispatch<SetStateAction<boolean>>;
    toggleBottom: Dispatch<SetStateAction<boolean>>;
  }
};

const SafeAreaConfigContext = React.createContext<SafeAreaConfigContextPayload | null>(null);

export function useSafeAreaConfigContext() {
  const payload = React.useContext(SafeAreaConfigContext);

  if (payload == null) {
    throw new Error("[Test] Expected to be wrapped in SafeAreaConfigContext");
  }

  return payload;
}

export function TestSAVRespectsWindowInsets() {
  const [isLeftEnabled, setIsLeftEnabled] = React.useState(false);
  const [isTopEnabled, setIsTopEnabled] = React.useState(false);
  const [isRightEnabled, setIsRightEnabled] = React.useState(false);
  const [isBottomEnabled, setIsBottomEnabled] = React.useState(false);

  const contextPayload: SafeAreaConfigContextPayload = React.useMemo(() => {
    return {
      props: {
        edges: {
          left: isLeftEnabled,
          top: isTopEnabled,
          right: isRightEnabled,
          bottom: isBottomEnabled,
        },
      },
      mutations: {
        toggleLeft: setIsLeftEnabled,
        toggleTop: setIsTopEnabled,
        toggleRight: setIsRightEnabled,
        toggleBottom: setIsBottomEnabled,
      }
    }
  }, [isLeftEnabled, isTopEnabled, isRightEnabled, isBottomEnabled]);

  return (
    <SafeAreaConfigContext value={contextPayload}>
      <ContentsView />
    </SafeAreaConfigContext>

  );
}

export function ContentsView() {
  const { props: safeAreaConfig } = useSafeAreaConfigContext();

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

export function SafeAreaConfigurationButtons(): React.ReactElement {
  const { mutations } = useSafeAreaConfigContext();

  const toggleLeft = React.useCallback(() => {
    mutations.toggleLeft(prev => !prev);
  }, [mutations]);

  const toggleTop = React.useCallback(() => {
    mutations.toggleTop(prev => !prev);
  }, [mutations]);

  const toggleRight = React.useCallback(() => {
    mutations.toggleRight(prev => !prev);
  }, [mutations]);

  const toggleBottom = React.useCallback(() => {
    mutations.toggleBottom(prev => !prev);
  }, [mutations]);

  return (
    <View style={[styles.centered, { maxWidth: '60%' }]}>
      <Button title="Toggle left" onPress={toggleLeft} />
      <Button title="Toggle top" onPress={toggleTop} />
      <Button title="Toggle right" onPress={toggleRight} />
      <Button title="Toggle bottom" onPress={toggleBottom} />
    </View>
  )
}

export function MarkerText(props: { text: string }) {
  return (
    <View style={{ display: 'contents' }}>
      <Text style={{ color: Colors.GreenLight20, fontSize: 32, fontWeight: 'bold' }}>{props.text}</Text>
    </View>
  );
}

export function SafeAreaMarkers() {
  return (
    <>
      <View style={[styles.safeAreaBar, styles.safeAreaBarVertical, { left: 0 }]}>
        <MarkerText text="LEFT" />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarHorizontal, { top: 0 }]}>
        <MarkerText text="TOP" />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarVertical, { right: 0 }]}>
        <MarkerText text="RIGHT" />
      </View>
      <View style={[styles.safeAreaBar, styles.safeAreaBarHorizontal, { bottom: 0 }]}>
        <MarkerText text="BOTTOM" />
      </View>
    </>
  )

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
  safeAreaBar: {
    position: 'absolute',
    // backgroundColor: Colors.GreenLight100,
    justifyContent: 'center',
  },
  safeAreaBarHorizontal: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
  },
  safeAreaBarVertical: {
    height: '100%',
    paddingHorizontal: 8,
  },
});
