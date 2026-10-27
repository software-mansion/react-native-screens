import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ZoomTransition from '@apps/shared/native/ZoomTransitionNativeComponent';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5054
//
// iOS 18+, FabricExample only (the zoom transition is set by a test-only
// native component). Cancelling the zoom dismissal of a screen with a header,
// pushed from a screen without one, left the navigation bar at alpha 0.

const ZOOM_SOURCE_ID = 'home-zoom-source';

type StackParamList = {
  Home: undefined;
  Zoomed: undefined;
  Headerless: undefined;
  Regular: undefined;
};

function HomeScreen({ navigation }: NativeStackScreenProps<ParamListBase>) {
  return (
    <View style={styles.screen}>
      <Text>Home (headerShown: false)</Text>
      <View testID={ZOOM_SOURCE_ID} style={styles.zoomSource}>
        <Button
          testID="home-button-push-zoomed"
          title="Zoom into Zoomed"
          onPress={() => navigation.push('Zoomed')}
        />
      </View>
      <Button
        testID="home-button-push-regular"
        title="Push Regular"
        onPress={() => navigation.push('Regular')}
      />
      <Text style={styles.step}>
        1. Zoom into Zoomed, drag down (or swipe from the leading edge) and
        release early. Zoomed's header (back button, Right item) stays.
      </Text>
      <Text style={styles.step}>
        2. Dismiss Zoomed completely, then push Regular. Its header is shown.
      </Text>
      <Text style={styles.step}>
        3. In Zoomed, push Headerless, start its zoom dismissal, release early,
        then go back. Zoomed's header is shown.
      </Text>
    </View>
  );
}

function ZoomedScreen({ navigation }: NativeStackScreenProps<ParamListBase>) {
  return (
    <View style={styles.screen}>
      <ZoomTransition testID="zoomed-bar-probe" sourceTestID={ZOOM_SOURCE_ID} />
      <Text testID="zoomed-text">Zoomed (headerShown: true)</Text>
      <View testID="zoomed-zoom-source" style={styles.zoomSource}>
        <Button
          testID="zoomed-button-push-headerless"
          title="Zoom into Headerless"
          onPress={() => navigation.push('Headerless')}
        />
      </View>
    </View>
  );
}

function HeaderlessScreen({
  navigation,
}: NativeStackScreenProps<ParamListBase>) {
  return (
    <View style={styles.screen}>
      <ZoomTransition sourceTestID="zoomed-zoom-source" />
      <Text testID="headerless-text">Headerless (headerShown: false)</Text>
      <Button
        testID="headerless-button-go-back"
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function ZoomedHeaderRight() {
  return <Text testID="zoomed-header-right">Right</Text>;
}

function RegularScreen() {
  return (
    <View style={styles.screen}>
      <ZoomTransition testID="regular-bar-probe" />
      <Text testID="regular-text">Regular (headerShown: true)</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<StackParamList>();

export default function Test5054() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Zoomed"
          component={ZoomedScreen}
          options={{
            headerRight: ZoomedHeaderRight,
          }}
        />
        <Stack.Screen
          name="Headerless"
          component={HeaderlessScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Regular" component={RegularScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: 'white',
  },
  zoomSource: {
    borderRadius: 12,
    backgroundColor: '#e6e6fa',
  },
  step: {
    fontSize: 14,
  },
});
