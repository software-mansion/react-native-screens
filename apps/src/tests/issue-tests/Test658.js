import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TransparentModal"
          component={Screen}
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Modal"
          component={Screen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({ navigation }) {
  const addedRoutes = navigation.getState().routes.length - 1;
  const margin = addedRoutes * 20;
  const width = Dimensions.get('screen').width - addedRoutes * 40;
  const backgroundColor = colors[addedRoutes % colors.length];
  return (
    <View
      style={[
        {
          width,
          margin,
          backgroundColor,
          height: '100%',
          borderWidth: 2,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Button
        title="Open transparent modal"
        onPress={() => navigation.push('TransparentModal')}
        testID={'screen-' + addedRoutes + '-button-open-transparent-modal'}
      />
      <Button
        title="Open modal"
        onPress={() => navigation.push('Modal')}
        testID={'screen-' + addedRoutes + '-button-open-modal'}
      />
      {addedRoutes > 0 && (
        <Button
          title="Back"
          onPress={() => navigation.goBack()}
          testID={'screen-' + addedRoutes + '-button-go-back'}
        />
      )}
      <Text style={{ padding: 10 }}>
        For each transparent modal you open, all previously visible screens
        should be visible underneath.
      </Text>
      <Text style={{ padding: 10 }}>
        For each new (non-transparent) modal you open, all previously visible
        screens should be hidden.
      </Text>
      <View style={{ width: '100%' }}>
        <Text testID="screen-text-added-routes-number" style={{ width: 20 }}>
          {addedRoutes}
        </Text>
      </View>
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
