import * as React from 'react';
import { Button, ScrollView, ImageBackground, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const AppStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{}}>
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

const image = { uri: "https://images.pexels.com/photos/6017203/pexels-photo-6017203.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" };

function First({navigation}) {
  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
          <ImageBackground source={image} style={{flex: 1}}>
            <View style={{backgroundColor: 'white', padding: 10, margin: 20, borderWidth: 1,  }}>
      <Button
        title="Open transparent modal with blurred background"
        onPress={() => navigation.navigate('Second')}
      />
      </View>
      </ImageBackground>
    </ScrollView>
  );
}


function Second({navigation}) {
  return (
    <ScrollView style={{position: 'absolute', top: '20%', bottom: '20%', left: '20%', right: '20%', borderWidth: 2, backgroundColor: 'white'}} >
      <Button 
        title="Close"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
}

