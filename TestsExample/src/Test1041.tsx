import * as React from 'react';
import {Button} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';
 
const Stack = createNativeStackNavigator();
 
type Props = {
 navigation: NativeStackNavigationProp<ParamListBase>;
}
 
function First({navigation}: Props) {
 return (
   <Button title="Tap me for second screen" onPress={() => navigation.navigate('Second')} />
 );
}
 
function Second({navigation}: Props) {
 return (
  <Button title="Tap me to replace second screen" onPress={() => navigation.replace('First')} />
 );
}

export default function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator>
       <Stack.Screen name="First" component={First} />
       <Stack.Screen
         name="Second"
         component={Second}
         options={{stackPresentation: 'modal'}}
       />
     </Stack.Navigator>
   </NavigationContainer>
 );
}
