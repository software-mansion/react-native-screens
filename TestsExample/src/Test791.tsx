import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const MainScreen = ({navigation}: Props) => {
  useEffect(() => {
    navigation.navigate('Modal')
  }, [])

  return (
    <View style={styles.screen}>
      <Text>Issue 791</Text>
    </View>
  )
}

const PushScreen = ({navigation}: Props) => (
  <View style={styles.screen}>
    <Button onPress={() => navigation.push('Push')} title="Mash this button to push" />
    <Button onPress={() => navigation.pop()} title="Mash this button to pop" />
  </View>
);

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
      />
      <Stack.Screen
        name="Push"
        component={PushScreen}
      />
      <Stack.Screen
        name="Modal"
        component={PushScreen}
        options={{ stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    paddingTop: 200,
    alignItems: 'center',
  },
});

export default App;
