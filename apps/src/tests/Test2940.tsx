import * as React from 'react';
import { View, Text, Button } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  CommonActions,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const screens = ['A', 'B', 'C'];

const Screen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
        title='Navigate home'
      />
      {screens.map(screenName => (
        <Button
          key={`navigate-${screenName}`}
          onPress={() => {
            navigation.dispatch(
              CommonActions.navigate(screenName)
            );
          }}
          title={`Navigate ${screenName}`}
        />
      ))}
      {screens.map(screenName => (
        <Button
          key={`preload-${screenName}`}
          onPress={() => {
            navigation.dispatch(
              CommonActions.preload(screenName)
            );
          }}
          title={`Preload ${screenName}`}
        />
      ))}
    </View>
  );
};

const Stack = createNativeStackNavigator({
  screens: {
    Home: Screen,
    ...Object.fromEntries(screens.map(screenName => [screenName, Screen])),
  },
});

const Navigation = createStaticNavigation(Stack);

export default function App() {
  return (
    <Navigation />
  );
}
