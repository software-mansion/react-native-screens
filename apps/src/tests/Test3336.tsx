import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Platform, Text, View, ViewStyle } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';
import { Spacer } from '../shared';
import Colors from '../shared/styling/Colors';
import { Edge, SafeAreaView } from 'react-native-screens/experimental';

type StackParamList = {
  Main: undefined;
  FormSheetWithFitToContents: undefined;
  FormSheetWithSmallDetent: undefined;
  FormSheetWithMediumDetent: undefined;
  FormSheetWithLargeDetent: undefined;
  FormSheetWithTwoDetents: undefined;
  FormSheetWithThreeDetents: undefined;
  FormSheetWithMaxDetent: undefined;
  FormSheetOverStatusBar: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

type MainProps = {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
  useSafeArea: boolean;
  edges: Partial<Record<Edge, boolean>>;
  toggleSafeArea: () => void;
  toggleTopEdge: () => void;
  toggleBottomEdge: () => void;
};

const EXAMPLES = [
  ['Fit to contents', 'FormSheetWithFitToContents'],
  ['1 small detent', 'FormSheetWithSmallDetent'],
  ['1 medium detent', 'FormSheetWithMediumDetent'],
  ['1 large detent', 'FormSheetWithLargeDetent'],
  ['2 detents', 'FormSheetWithTwoDetents'],
  ['3 detents', 'FormSheetWithThreeDetents'],
  ['Max detent', 'FormSheetWithMaxDetent'],
  ['Partially covered status bar', 'FormSheetOverStatusBar'],
];

const Main = ({
  navigation,
  useSafeArea,
  edges,
  toggleSafeArea,
  toggleTopEdge,
  toggleBottomEdge,
}: MainProps) => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginVertical: 4 }}>
        [Android] Use SafeAreaView: {useSafeArea ? 'true' : 'false'}
      </Text>
      <Text style={{ fontSize: 20, marginVertical: 4 }}>
        [Android] Edges, top: {edges.top ? 'enabled' : 'disabled'}, bottom:{' '}
        {edges.bottom ? 'enabled' : 'disabled'}
      </Text>
      <View style={{ marginVertical: 4 }}>
        <Button onPress={toggleSafeArea} title="Toggle SAV" />
      </View>
      <View style={{ marginVertical: 4 }}>
        <Button onPress={toggleTopEdge} title="Toggle top edge" />
      </View>
      <View style={{ marginVertical: 4 }}>
        <Button onPress={toggleBottomEdge} title="Toggle bottom edge" />
      </View>
      <View
        style={{
          width: '100%',
          height: 1,
          marginVertical: 4,
          backgroundColor: 'black',
        }}
      />
      {EXAMPLES.map(([title, screen]) => (
        <View key={screen} style={{ marginVertical: 4 }}>
          <Button
            title={title}
            onPress={() => navigation.navigate(screen as keyof StackParamList)}
          />
        </View>
      ))}
    </View>
  );
};

const formSheetBaseOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  animation: 'slide_from_bottom',
  headerShown: false,
  contentStyle: {
    backgroundColor: Colors.GreenLight100,
  },
};

const PressableBase = () => (
  <PressableWithFeedback>
    <View
      style={{
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
      }}>
      <Text>Pressable</Text>
    </View>
  </PressableWithFeedback>
);

const FormSheetBase = () => (
  <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <PressableBase />
    <PressableBase />
  </View>
);

const FormSheetNoFlex = () => (
  <View>
    <PressableBase />
    <Spacer space={100} />
    <PressableBase />
  </View>
);

const withOptionalSafeArea =
  (
    Component: React.ComponentType,
    useSafeArea: boolean,
    safeAreaEdges?: Partial<Record<Edge, boolean>>,
    safeAreaStyle?: ViewStyle,
  ) =>
  () => {
    if (Platform.OS === 'android' && useSafeArea) {
      return (
        <SafeAreaView edges={safeAreaEdges} style={safeAreaStyle}>
          <Component />
        </SafeAreaView>
      );
    }
    return <Component />;
  };

export default function App() {
  const [useSafeArea, setUseSafeArea] = useState(true);
  const [safeAreaEdges, setSafeAreaEdges] = useState({
    top: true,
    bottom: true,
  });
  const toggleSafeArea = () => setUseSafeArea(prev => !prev);
  const toggleTopEdge = () =>
    setSafeAreaEdges(prev => ({ ...prev, top: !prev.top }));
  const toggleBottomEdge = () =>
    setSafeAreaEdges(prev => ({ ...prev, bottom: !prev.bottom }));

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          options={{ title: 'Main' }}
          children={({ navigation }) => (
            <Main
              navigation={navigation}
              useSafeArea={useSafeArea}
              edges={safeAreaEdges}
              toggleSafeArea={toggleSafeArea}
              toggleTopEdge={toggleTopEdge}
              toggleBottomEdge={toggleBottomEdge}
            />
          )}
        />
        <Stack.Screen
          name="FormSheetWithFitToContents"
          component={withOptionalSafeArea(
            FormSheetNoFlex,
            useSafeArea,
            safeAreaEdges,
            {
              flex: 0,
            },
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
        <Stack.Screen
          name="FormSheetWithSmallDetent"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.2],
          }}
        />
        <Stack.Screen
          name="FormSheetWithMediumDetent"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.5],
          }}
        />
        <Stack.Screen
          name="FormSheetWithLargeDetent"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.8],
          }}
        />
        <Stack.Screen
          name="FormSheetWithTwoDetents"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.6],
          }}
        />
        <Stack.Screen
          name="FormSheetWithThreeDetents"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.3, 0.6, 0.9],
          }}
        />
        <Stack.Screen
          name="FormSheetWithMaxDetent"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [1.0],
          }}
        />
        <Stack.Screen
          name="FormSheetOverStatusBar"
          component={withOptionalSafeArea(
            FormSheetBase,
            useSafeArea,
            safeAreaEdges,
          )}
          options={{
            ...formSheetBaseOptions,
            sheetAllowedDetents: [0.99],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
