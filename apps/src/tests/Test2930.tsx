import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, View, TextInput} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const RootStack = createNativeStackNavigator();

function RootStackHost() {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Root" component={RootScreen} options={{}} />
      <RootStack.Screen name="FormSheet" component={FormSheet} options={{
        presentation: 'formSheet',
        sheetAllowedDetents: 'fitToContents',
        // sheetAllowedDetents: [0.5, 0.7],
      }} />
    </RootStack.Navigator>
  );
}

const RootScreen = ({navigation}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <TextInput style={{borderColor: '#f0f', borderWidth: 1, padding: 10, backgroundColor: '#fff'}} />
    <Button title="Go to Tabs" onPress={() => navigation.navigate('FormSheet')} />
  </View>
);

const FormSheet = ({navigation}) => {

  return (
      <View style={{
        // flex: 1,
        height: 400,
        borderWidth: 5,
        borderColor: '#ff0',
      }}>
        <TextInput style={{borderColor: '#f0f', borderWidth: 1, padding: 10, backgroundColor: '#fff'}} />
      </View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <RootStackHost />
    </NavigationContainer>
  );
}
export default App;
