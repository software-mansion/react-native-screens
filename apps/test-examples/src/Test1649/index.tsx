import * as React from 'react';
import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  NativeSyntheticEvent,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from 'react-native-screens/native-stack';

import * as jotai from 'jotai';

// import useFocusEffectIgnoreSheet from './hooks/useFocusEffectIgnoreSheet';
import { sheetOptionsAtom } from './state';

import Home from './screens/Home';
import Second from './screens/Second';
import Third from './screens/Third';
import SheetScreen from './screens/SheetScreen';
import SheetScreenWithScrollView from './screens/SheetScreenWithScrollView';
import ModalScreen from './screens/ModalScreen';
import PushWithScrollView from './screens/PushWithScrollView';

const Stack = createNativeStackNavigator();

const InnerStack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const sheetOptions = jotai.useAtomValue(sheetOptionsAtom);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              color: 'seagreen',
            },
            headerShown: true,
            headerHideBackButton: false,
            statusBarTranslucent: false,
            headerTopInsetEnabled: false,
          }}>
          <Stack.Screen name="First" component={Home} />
          <Stack.Screen
            name="Second"
            component={Second}
            options={{
              fullScreenSwipeEnabled: true,
            }}
          />
          <Stack.Screen
            name="PushWithScrollView"
            component={PushWithScrollView}
          />
          <Stack.Screen
            name="SheetScreen"
            component={SheetScreen}
            options={{
              headerShown: false,
              stackPresentation: 'formSheet',
              sheetElevation: 24,
              screenStyle: {
                backgroundColor: 'firebrick',
              },
              // footerComponent: Footer(),
              onSheetDetentChanged: (
                e: NativeSyntheticEvent<{ index: number; isStable: boolean }>,
              ) => {
                console.log(
                  `onSheetDetentChanged in App with index ${e.nativeEvent.index} isStable: ${e.nativeEvent.isStable}`,
                );
              },
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="SheetScreenWithScrollView"
            component={SheetScreenWithScrollView}
            options={{
              headerShown: false,
              stackPresentation: 'formSheet',
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="Third"
            component={Third}
            options={{
              // stackPresentation: 'modal',
              headerShown: true,
              fullScreenSwipeEnabled: true,
            }}
          />
          <Stack.Screen name="NestedStack" component={NestedStack} />
          <Stack.Screen
            name="ModalScreen"
            component={ModalScreen}
            options={{
              headerShown: false,
              stackPresentation: 'modal',
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="AnotherSheetScreen"
            component={SheetScreen}
            options={{
              headerShown: false,
              stackPresentation: 'formSheet',
              sheetElevation: 24,
              screenStyle: {
                backgroundColor: 'firebrick',
              },
              ...sheetOptions,
              sheetAllowedDetents: [0.7],
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function NestedStack(): React.JSX.Element {
  return (
    <InnerStack.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <InnerStack.Screen name="NestedSheet" component={Third} />
    </InnerStack.Navigator>
  );
}

