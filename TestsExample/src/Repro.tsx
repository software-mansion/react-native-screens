import * as React from 'react';

import {View, Button} from 'react-native';

// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BottomTabStack" component={BottomNavigator} />

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
};

const BottomNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};

const HomeScreen = props => {
  return (
    <View style={{flex: 1, backgroundColor: 'gold'}}>
      <Button
        title="Navigate to Landscape screen"
        onPress={() => props.navigation.navigate('Landscape')}
      />
    </View>
  );
};

const LandscapeScreen = props => {
  return (
    <View style={{flex: 1, backgroundColor: 'purple'}}>
      <Button title="Back" onPress={props.navigation.goBack} />
    </View>
  );
};

// export default App;

function First({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: 'gold'}}>
      <Button
        title="Navigate to Landscape screen"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function Second({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: 'purple'}}>
      <Button title="Back" onPress={navigation.goBack} />
    </View>
  );
}

function AppImproved({navigation}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{screenOrientation: 'portrait_up'}}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{screenOrientation: 'landscape_right'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppImproved;
