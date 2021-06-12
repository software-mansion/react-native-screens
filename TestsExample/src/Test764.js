import * as React from 'react';
import {Button, ScrollView, ImageBackground, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const AppStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen
          name="Second"
          component={Second}
          options={{
            stackPresentation: 'transparentModal',
          }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

const image = {
  uri:
    'https://images.pexels.com/photos/6017203/pexels-photo-6017203.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
};

function First({navigation}) {
  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <ImageBackground source={image} style={{flex: 1}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            margin: 20,
            borderWidth: 1,
          }}>
          <Button
            title="Open transparent modal with blurred background"
            onPress={() => navigation.navigate('Second')}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

let i = 1;

function Second({navigation}) {
  return (
    <ScrollView
      style={{
        position: 'absolute',
        top: 5 * i + '%',
        bottom: 5 * i + '%',
        left: 5 * i + '%',
        right: 5 * i + '%',
        borderWidth: 2,
        backgroundColor: 'white',
      }}>
      <Button
        title="Open transparent modal with blurred background"
        onPress={() => {
          i++;
          navigation.push('Second');
        }}
      />
      <Button
        title="Close"
        onPress={() => {
          if (i > 1) i--;
          navigation.goBack();
        }}
      />
    </ScrollView>
  );
}
