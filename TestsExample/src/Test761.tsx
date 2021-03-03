import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
};

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{stackAnimation: 'simple_push'}}>
        <Stack.Screen name="First" component={First} options={{gestureEnabled: false}}/>
        <Stack.Screen
          name="Second"
          component={Second}
          options={{gestureEnabled: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}: {navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>}) {
  React.useEffect(() => {
    navigation.setOptions({
      onTransitionProgress: (event) => console.warn(event.nativeEvent.progress),
    })
  }, [navigation])

  return (
    <View style={{backgroundColor: 'red', flex: 1}}>
      <Button title="Tap me for second screen" onPress={() => navigation.navigate('Second')} />
    </View>
  );
}

function Second({navigation}: {navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>}) {
  return (
    <View style={{backgroundColor: 'yellow', flex: 1}}>
      <Button title="Tap me for first screen" onPress={() => navigation.navigate('First')} />
    </View>
  );
}

