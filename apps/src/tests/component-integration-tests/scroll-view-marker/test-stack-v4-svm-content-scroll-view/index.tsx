import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ScrollViewMarker } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Rectangle } from '@apps/shared/Rectangle';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

type StackParamList = {
  Home: undefined;
  Pushed: undefined;
  Sheet: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

// Taken once at module scope so the colors stay stable across re-renders
// (generateNextColor advances a global counter on every call).
const RECT_COLORS = Array.from({ length: 24 }, () => generateNextColor());

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Button
        title="Push screen"
        testID="svm-stack-v4-push"
        onPress={() => navigation.navigate('Pushed')}
      />
      <Button
        title="Open formSheet"
        testID="svm-stack-v4-sheet"
        onPress={() => navigation.navigate('Sheet')}
      />
    </View>
  );
}

function MarkedListScreen() {
  return (
    <View style={styles.fillParent}>
      {/* Takes the first-subview chain, so UIKit cannot find the ScrollView on its own. */}
      <View style={[StyleSheet.absoluteFill, styles.background]} />
      <ScrollViewMarker
        style={styles.fillParent}
        scrollEdgeEffects={{ top: 'soft' }}>
        <ScrollView
          style={styles.fillParent}
          contentInsetAdjustmentBehavior="automatic">
          {RECT_COLORS.map((color, index) => (
            <Rectangle key={index} color={color} width={'100%'} height={96} />
          ))}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

function TestStackV4SvmContentScrollView() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Pushed"
            component={MarkedListScreen}
            options={{ headerLargeTitleEnabled: true, title: 'Pushed' }}
          />
          <Stack.Screen
            name="Sheet"
            component={MarkedListScreen}
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [1.0],
              headerShown: true,
              headerLargeTitleEnabled: true,
              title: 'Sheet',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  background: {
    backgroundColor: Colors.White,
  },
});

export default createScenario(
  TestStackV4SvmContentScrollView,
  scenarioDescription,
);
