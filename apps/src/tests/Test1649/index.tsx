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
import { sheetOptionsAtom } from './state';

import Routes from './routes';

import Home from './screens/Home';
import Third from './screens/Third';
import SheetScreen from './screens/SheetScreen';
import SheetScreenWithScrollView from './screens/SheetScreenWithScrollView';
import ModalScreen from './screens/ModalScreen';
import PushWithScrollView from './screens/PushWithScrollView';
import Second from './screens/Second';


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
              presentation: 'formSheet',
              sheetElevation: 24,
              contentStyle: {
                backgroundColor: 'firebrick',
              },
              // unstable_footerComponent: Footer(),
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="SheetScreenWithScrollView"
            component={SheetScreenWithScrollView}
            options={{
              headerShown: false,
              presentation: 'formSheet',
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
              presentation: 'modal',
              ...sheetOptions,
            }}
          />
          <Stack.Screen
            name="AnotherSheetScreen"
            component={SheetScreen}
            options={{
              headerShown: false,
              presentation: 'formSheet',
              sheetElevation: 24,
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
        headerTitleStyle: {
          color: 'firebrick',
        },
        statusBarTranslucent: false,
      }}>
      <InnerStack.Screen name="NestedThird" component={Third} />
    </InnerStack.Navigator>
  );
}

