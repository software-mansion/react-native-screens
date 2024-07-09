import * as React from 'react';
import { Button, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    I18nManager.forceRTL(true);

    return () => {
      I18nManager.forceRTL(false);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({ navigation }) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.popTo('First')}
    />
  );
}
