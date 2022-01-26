import React, {useEffect} from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {Text} from 'react-native';

const Stack = createNativeStackNavigator();
const NStack = createNativeStackNavigator();

const NStackNavigator = (): JSX.Element => {
  return (
    <NStack.Navigator>
      <NStack.Screen name="Main" component={MainScreen} />
    </NStack.Navigator>
  );
};

type Props = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const MainScreen = ({navigation}: Props): JSX.Element => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionStart', () => {
      console.log('1');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', () => {
      console.log('2');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Text>Android</Text>
      <Text>
        Reload app a few times in terminal to see events fire more than once
      </Text>
    </>
  );
};

const App = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={NStackNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
