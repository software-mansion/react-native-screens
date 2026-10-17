import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigationState,
  type NavigatorScreenParams,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type InnerStackParamList = {
  List: undefined;
  InnerSheet: undefined;
};

type RootStackParamList = {
  Home: NavigatorScreenParams<InnerStackParamList> | undefined;
  OuterSheet: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const InnerStack = createNativeStackNavigator<InnerStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

function openInnerSheetAfter(delay: number) {
  setTimeout(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('Home', { screen: 'InnerSheet' });
    }
  }, delay);
}

function ListScreen({
  navigation,
}: NativeStackScreenProps<InnerStackParamList, 'List'>) {
  const routes = useNavigationState(state => state.routes.map(r => r.name));

  return (
    <View style={styles.screen} testID="test4949-list">
      <Text style={styles.description}>
        1. Open the outer sheet (root stack){'\n'}
        2. Tap "Close, then open inner sheet at once"{'\n'}
        Expected: the inner sheet (nested stack) appears.{'\n'}
        Bug: no sheet, although the inner stack state has InnerSheet.
      </Text>
      <Text style={styles.state} testID="test4949-inner-routes">
        Inner stack: {JSON.stringify(routes)}
      </Text>
      <Button
        title="Open outer sheet"
        testID="test4949-open-outer-sheet"
        onPress={() => navigationRef.navigate('OuterSheet')}
      />
      <Button
        title="Open inner sheet"
        testID="test4949-open-inner-sheet"
        onPress={() => navigation.navigate('InnerSheet')}
      />
    </View>
  );
}

function InnerSheetScreen({
  navigation,
}: NativeStackScreenProps<InnerStackParamList, 'InnerSheet'>) {
  return (
    <View style={styles.sheet} testID="test4949-inner-sheet">
      <Text style={styles.title}>Inner sheet (nested stack)</Text>
      <Button
        title="Close"
        testID="test4949-close-inner-sheet"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function OuterSheetScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'OuterSheet'>) {
  return (
    <View style={styles.sheet} testID="test4949-outer-sheet">
      <Text style={styles.title}>Outer sheet (root stack)</Text>
      <Button
        title="Close, then open inner sheet at once"
        testID="test4949-close-open-inner-sheet"
        onPress={() => {
          navigation.goBack();
          openInnerSheetAfter(0);
        }}
      />
      <Button
        title="Close, then open inner sheet after 1 s"
        testID="test4949-close-open-inner-sheet-delayed"
        onPress={() => {
          navigation.goBack();
          openInnerSheetAfter(1000);
        }}
      />
    </View>
  );
}

function Home() {
  return (
    <InnerStack.Navigator>
      <InnerStack.Screen name="List" component={ListScreen} />
      <InnerStack.Screen
        name="InnerSheet"
        component={InnerSheetScreen}
        options={{ presentation: 'formSheet', sheetAllowedDetents: [0.4] }}
      />
    </InnerStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="OuterSheet"
          component={OuterSheetScreen}
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.4] }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  sheet: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
  },
  state: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
});
