import React from 'react';
import {Button, ScrollView, View} from 'react-native';
import {NavigationContainer, NavigationProp, ParamListBase} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

function HomeScreen({navigation}: {navigation: NavigationProp<ParamListBase>}) {
  return (
    <Button
      onPress={() => {
        navigation.navigate('Details');
      }}
      title="Go to details"
    />
  );
}

function DetailsScreen({navigation}: {navigation: NavigationProp<ParamListBase>}) {
  return (
    <ScrollView>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
          onPress={() => {
            navigation.goBack()
          }}
          title="Go back"
        />
      </View>
    </ScrollView>
  );
}

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator screenOptions={{stackAnimation: "slide_from_bottom"}}>
      <RootStack.Screen name="Home" component={HomeScreen}/>
      <RootStack.Screen name="Details" component={DetailsScreen} />
    </RootStack.Navigator>
  );
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
}
