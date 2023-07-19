import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

export const Modal1 = React.memo(() => {
  return <View style={{ flexGrow: 1, backgroundColor: 'red', opacity: 0.7 }} />;
});

export const Modal2 = React.memo(() => {
  return (
    <View style={{ flexGrow: 1, backgroundColor: 'blue', opacity: 0.7 }} />
  );
});
export const MainScreen = React.memo(() => {
  const navigation = useNavigation();
  return (
    <View
      style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={'Open modal 1'}
        onPress={() => {
          navigation.navigate('modalScreen-1');
        }}
      />
      <Button
        title={'Open modal 2'}
        onPress={() => {
          navigation.navigate('modalScreen-2');
        }}
      />
    </View>
  );
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen key={'main'} name={'main'} component={MainScreen} />
          <Stack.Screen
            key={'modalScreen-1'}
            name={'modalScreen-1'}
            component={Modal1}
            options={{ stackPresentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            key={'modalScreen-2'}
            name={'modalScreen-2'}
            component={Modal2}
            options={{ stackPresentation: 'modal', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
});
