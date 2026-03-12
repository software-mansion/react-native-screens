import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, ScrollView, Text, View } from 'react-native';
import LongText from '../../shared/LongText';

type RouteParamList = {
  Screen1: undefined;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function Screen1() {
  return (
    <ScrollView>
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 200,
          justifyContent: 'center',
        }}>
        <Text style={{ fontWeight: 'bold' }}>
          Use iPadOS 26+. Scroll down and tap the subviews. The scroll view
          SHOULD NOT scroll to top unless header is tapped outside of any header
          subview.
        </Text>
      </View>
      <LongText size="xl" />
      <LongText size="xl" />
      <LongText size="xl" />
    </ScrollView>
  );
}

const headerButton = (
  <Button title="Click me" onPress={() => console.log('Button clicked!')} />
);
const headerButtonFn = () => headerButton;

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{
            headerLeft: headerButtonFn,
            headerTitle: headerButtonFn,
            unstable_headerRightItems: () => [
              {
                type: 'custom',
                element: headerButton,
                hidesSharedBackground: true,
              },
            ],
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
