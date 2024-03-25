import * as React from 'react';

import { View, Button } from 'react-native';

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ screenOrientation: 'portrait' }}
        />

        <Stack.Screen
          name="Landscape"
          component={LandscapeScreen}
          options={{
            screenOrientation: 'landscape_right',
            stackAnimation: 'slide_from_bottom',
            stackPresentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }: NavProp) {
  return (
    <View style={{ flex: 1, backgroundColor: 'gold' }}>
      <Button
        title="Navigate to Landscape screen"
        onPress={() => navigation.navigate('Landscape')}
      />
    </View>
  );
}

function LandscapeScreen({ navigation }: NavProp) {
  return (
    <View style={{ flex: 1, backgroundColor: 'purple' }}>
      <Button title="Back" onPress={navigation.goBack} />
    </View>
  );
}

export default App;
