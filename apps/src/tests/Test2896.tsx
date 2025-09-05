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
import { Button, StyleSheet, View, Text } from 'react-native';

const FORM_SHEET_CONFIGURATIONS: Record<string, NativeStackNavigationOptions> =
  {
    SingleDetentFullExpanded: {
      sheetAllowedDetents: [1],
    },
    SingleDetentCloseToFullExpanded: {
      sheetAllowedDetents: [0.99],
    },
    TwoDetentsInitCollapsed: {
      sheetAllowedDetents: [0.5, 1],
    },
    TwoDetentsInitExpanded: {
      sheetAllowedDetents: [0.5, 1],
      sheetInitialDetentIndex: 1,
    },
    ThreeDetentsInitCollapsed: {
      sheetAllowedDetents: [0.3, 0.5, 1],
    },
    ThreeDetentsInitHalfExpanded: {
      sheetAllowedDetents: [0.3, 0.5, 1],
      sheetInitialDetentIndex: 1,
    },
    ThreeDetentsInitExpanded: {
      sheetAllowedDetents: [0.3, 0.5, 1],
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
    <View style={{ backgroundColor: 'goldenrod', flex: 1 }}>
      <View>
        <Text
          style={{ fontSize: 10, marginTop: 5, textAlign: 'center' }}
          testID="home-text-behind-status-bar">
          This shouldn't be covered by formSheet.
        </Text>
      </View>
      <View
        style={{
          flex: 0,
          minHeight: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text testID="home-text-behind-form-sheet">
          This should be covered by expanded formSheet.
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
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
    </View>
  );
}

function FormSheet({ route }: StackNavigationProp) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>{route.name}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        {Object.keys(FORM_SHEET_CONFIGURATIONS).map(key => (
          <Stack.Screen
            name={key}
            key={key}
            component={FormSheet}
            options={{
              presentation: 'formSheet',
              ...FORM_SHEET_CONFIGURATIONS[key],
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    height: 40,
  },
});
