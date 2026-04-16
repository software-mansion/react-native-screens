import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

type RouteParamList = {
  Home: undefined;
};

type StackNavigationProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function HomeScreen({ navigation }: StackNavigationProp) {
  useEffect(() => {
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          type: 'menu',
          label: 'Menu 1',
          menu: {
            items: [
              {
                type: 'action',
                label: 'Action 1',
                onPress: () => Alert.alert('Menu 1', 'Action 1'),
              },
              {
                type: 'submenu',
                label: 'Submenu 1',
                items: [
                  {
                    type: 'action',
                    label: 'Action 1',
                    onPress: () => Alert.alert('Submenu 1', 'Action 1'),
                  },
                  {
                    type: 'action',
                    label: 'Action 2',
                    onPress: () => Alert.alert('Submenu 1', 'Action 2'),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'menu',
          label: 'Menu 2',
          menu: {
            items: [
              {
                type: 'action',
                label: 'Action 1',
                onPress: () => Alert.alert('Menu 2', 'Action 1'),
              },
              {
                type: 'action',
                label: 'Action 2',
                onPress: () => Alert.alert('Menu 2', 'Action 2'),
              },
            ],
          },
        },
      ],
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        menuId collision: submenu vs top-level menu
      </Text>

      <Text style={styles.description}>
        <Text style={styles.bold}>Steps to reproduce{'\n'}</Text>
        1. Tap Menu 1{'\n'}
        2. Open Submenu 1{'\n'}
        3. Select Action 1{'\n\n'}
        <Text style={styles.pass}>
          <Text style={styles.bold}>Expected alert:{'\n'}</Text>
          Submenu 1{'\n'}
          Action 1{'\n\n'}
        </Text>
        <Text style={styles.bug}>
          <Text style={styles.bold}>Bug alert:{'\n'}</Text>
          Menu 1{'\n'}
          Action 1{'\n'}
        </Text>
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  pass: {
    color: 'green',
  },
  bug: {
    color: 'red',
  },
  bold: {
    fontWeight: 'bold',
  },
});
