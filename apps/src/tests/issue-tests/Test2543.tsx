import React from 'react';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import Colors from '../../shared/styling/Colors';

const FORM_SHEET_CONFIGURATIONS: Record<string, NativeStackNavigationOptions> =
  {
    TwoDetentsInitialFirst: {
      sheetAllowedDetents: [0.3, 0.55],
    },
    TwoDetentsInitialSecond: {
      sheetAllowedDetents: [0.3, 0.55],
      sheetInitialDetentIndex: 1,
    },
    ThreeDetentsInitialFirst: {
      sheetAllowedDetents: [0.3, 0.55, 0.8],
    },
    ThreeDetentsInitialSecond: {
      sheetAllowedDetents: [0.3, 0.55, 0.8],
      sheetInitialDetentIndex: 1,
    },
    ThreeDetentsInitialThird: {
      sheetAllowedDetents: [0.3, 0.55, 0.8],
      sheetInitialDetentIndex: 2,
    },
  };

type StackRouteParamList = {
  Home: undefined;
} & {
  [P in keyof typeof FORM_SHEET_CONFIGURATIONS]: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
  route: RouteProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  return (
    <View
      style={{
        backgroundColor: Colors.GreenLight40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
      }}>
      {Object.keys(FORM_SHEET_CONFIGURATIONS).map(key => (
        <Button
          title={key}
          key={key}
          onPress={() => navigation.navigate(key)}
          testID={`home-button-open-${key}`}
        />
      ))}
    </View>
  );
}

function FormSheet({ route }: StackNavigationProp) {
  return (
    <View style={{ paddingTop: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 16,
          textAlign: 'center',
        }}
        testID={`${route.name}-text-header`}>
        {route.name}
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 16 }}>
        You should be able to easily switch between detents.
      </Text>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 180,
        }}>
        <Text testID={`${route.name}-text-first-detent`}>
          This should be visible on first detent.
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 180,
          backgroundColor: Colors.PurpleLight40,
        }}>
        <Text testID={`${route.name}-text-second-detent`}>
          This should be visible on second detent.
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          backgroundColor: Colors.NavyLight40,
        }}>
        <Text testID={`${route.name}-text-third-detent`}>
          This should be visible on third detent.
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        {Object.keys(FORM_SHEET_CONFIGURATIONS).map(key => (
          <Stack.Screen
            name={key}
            key={key}
            component={FormSheet}
            options={{
              presentation: 'formSheet',
              sheetGrabberVisible: true,
              ...FORM_SHEET_CONFIGURATIONS[key],
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
