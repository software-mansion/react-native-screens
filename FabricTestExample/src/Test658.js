import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {Button, Dimensions, Text, View} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TransparentModal"
          component={Screen}
          options={{
            stackPresentation: 'transparentModal',
            stackAnimation: 'slide_from_bottom',
            headerMode: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Modal"
          component={Screen}
          options={{
            stackPresentation: 'modal',
            headerMode: 'none',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({navigation}) {
  const addedRoutes = navigation.dangerouslyGetState().routes.length - 1;
  const margin = addedRoutes * 20;
  const width = Dimensions.get('screen').width - addedRoutes * 40;
  const backgroundColor = colors[addedRoutes % colors.length];
  return (
    <View
      style={[
        {width, margin, backgroundColor, height: '100%', borderWidth: 2},
      ]}>
      <Button
        title="Open transparent modal"
        onPress={() => navigation.push('TransparentModal')}
      />
      <Button title="Open modal" onPress={() => navigation.push('Modal')} />
      {addedRoutes > 0 && (
        <Button title="Back" onPress={() => navigation.goBack()} />
      )}
      <Text style={{padding: 10}}>
        For each transparent modal you open, all previously visible screens
        should be visible underneath.
      </Text>
      <Text style={{padding: 10}}>
        For each new (non-transparent) modal you open, all previously visible
        screens should be hidden.
      </Text>
    </View>
  );
}

const colors = [
  'darkviolet',
  'slateblue',
  'mediumseagreen',
  'khaki',
  'orange',
  'indianred',
];
