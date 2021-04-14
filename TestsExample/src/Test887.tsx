import * as React from 'react';
import {Button, View, Animated} from 'react-native';
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
      <Stack.Navigator screenOptions={{ 
        // stackAnimation: 'fade', 
        // stackPresentation: 'modal' 
        }}>
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
  const [width, setWidth] = React.useState(50);
  React.useEffect(() => {
    navigation.setOptions({
      onTransitionProgress: (event) => {
        console.warn(event.nativeEvent.progress);
        setWidth(event.nativeEvent.progress * 50 + 50);
      }
    })
  }, [navigation])
  return (
    <View style={{backgroundColor: 'red', flex: 1}}>
      <Button title="Tap me for second screen" onPress={() => navigation.navigate('Second')} />
      <Animated.View style={{width, height: width, backgroundColor: 'black'}} />
    </View>
  );
}
function Second({navigation}: {navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>}) {
  const [width, setWidth] = React.useState(50);
  React.useEffect(() => {
    navigation.setOptions({
      onTransitionProgress: (event) => {
        console.warn(event.nativeEvent.progress);
        setWidth(event.nativeEvent.progress * 50 + 50);
      }
    })
  }, [navigation])

  return (
    <View style={{backgroundColor: 'yellow', flex: 1}}>
      <Button title="Tap me for first screen" onPress={() => navigation.navigate('First')} />
      <Animated.View style={{width, height: width, backgroundColor: 'black'}} />
    </View>
  );
}
