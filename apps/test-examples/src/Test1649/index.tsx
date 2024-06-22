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
} from '@react-navigation/native-stack';

import * as jotai from 'jotai';

// import useFocusEffectIgnoreSheet from './hooks/useFocusEffectIgnoreSheet';
import { sheetOptionsAtom, sheetInitialOptions } from './state';

import Routes from './routes';

import Home from './screens/Home';
import Second from './screens/Second';
import Third from './screens/Third';
import SheetScreen from './screens/SheetScreen';
import SheetScreenWithScrollView from './screens/SheetScreenWithScrollView';
import ModalScreen from './screens/ModalScreen';
import PushWithScrollView from './screens/PushWithScrollView';
import SheetScreenWithTextInput from './screens/SheetScreenWithTextInput';


// Attempt to use v7 API,
const Stack = createNativeStackNavigator({
  screens: {
    First: Home,
    Second: {
      screen: Second,
      options: {
        fullScreenGestureEnabled: true,
      },
    },
    Third: {
      screen: Third,
      options: {
        headerShown: true,
        fullScreenGestureEnabled: true,
      }
    },
    Sheet: {
      screen: SheetScreen,
      options: {
        headerShown: false,
        presentation: 'formSheet',
        sheetElevation: 24,
        screenStyle: {
          backgroundColor: 'firebrick',
        },
        onSheetDetentChanged: (
          e: NativeSyntheticEvent<{ index: number; isStable: boolean }>,
        ) => {
          console.log(
            `onSheetDetentChanged in App with index ${e.nativeEvent.index} isStable: ${e.nativeEvent.isStable}`,
          );
        },
        ...sheetInitialOptions,
      },
    },
    Modal: {
      screen: SheetScreen,
      options: {
        headerShown: false,
        presentation: 'modal',
        ...sheetInitialOptions,
      }
    },
    PushWithScrollView: PushWithScrollView,
    SheetWithScrollView: {
      screen: SheetScreenWithScrollView,
      options: {
        headerShown: false,
        presentation: 'formSheet',
        ...sheetInitialOptions,
      },
    },
    SheetWithTextInput: {
      screen: SheetScreenWithTextInput,
      options: {
        headerShown: false,
        presentation: 'formSheet',
        ...sheetInitialOptions,
      },
    },
    AnotherSheet: {
      screen: SheetScreen,
      options: {
        headerShown: false,
        presentation: 'formSheet',
        sheetElevation: 24,
        sheetAllowedDetents: [0.5, 0.8],
        screenStyle: {
          backgroundColor: 'firebrick',
        },
        ...sheetInitialOptions,
      }
    }
  },
  screenOptions: {
    headerTitleStyle: {
      color: 'seagreen',
    },
    headerShown: true,
    statusBarTranslucent: false,
  }
});

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
            statusBarTranslucent: false,
          }}>
          <Stack.Screen name="First" component={Home} />
          <Stack.Screen
            name={Routes.Second.name}
            component={Routes.Second.component}
            options={{
              fullScreenGestureEnabled: true,
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
              headerShown: true,
              fullScreenGestureEnabled: true,
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

