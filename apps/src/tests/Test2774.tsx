import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, View, TextInput} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../shared/styling/Colors';


const RootStack = createNativeStackNavigator();

function RootStackHost() {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Root" component={RootScreen} options={{}} />
      <RootStack.Screen name="FormSheet" component={FormSheet} options={{
        presentation: 'formSheet',
        // sheetAllowedDetents: 'fitToContents',
        sheetAllowedDetents: [0.2, 1.0],
      }} />
    </RootStack.Navigator>
  );
}

const RootScreen = ({navigation}) => (
  <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
    <TextInput style={{borderColor: Colors.NavyLightTransparent, borderWidth: 1, padding: 10, backgroundColor: '#fff'}} />
    <Button title="Open formsheet" onPress={() => navigation.navigate('FormSheet')} />
  </View>
);

const FormSheet = ({navigation}) => {

  return (
      <View style={{
        flex: 1,
        // height: 400,
        borderWidth: 4,
        borderColor: Colors.GreenDark60,
      }}>
        <TextInput style={{borderColor: Colors.NavyLightTransparent, borderWidth: 1, padding: 10, backgroundColor: '#fff'}} />
        <Button title="Press" onPress={() => {}} />
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
