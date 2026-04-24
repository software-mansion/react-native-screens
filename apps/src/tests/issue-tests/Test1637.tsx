import React from 'react';
import { TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const backgroundStyle = {
    backgroundColor: '#fafffe', // isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View
      style={[
        backgroundStyle,
        {
          flex: 1,
        },
      ]}>
      <View
        style={{
          flex: 1,
          height: '100%',
        }}>
        <Navigation />
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator();

function ScreenA({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={() => navigation.navigate('ScreenB')}>
        Go to Screen B
      </Button>
    </View>
  );
}

function ScreenB({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, }}>
      <TextInput
        placeholder="Enter text"
        style={{
          height: 40,
          width: '80%',
          borderWidth: 1,
          borderRadius: 5,
          alignSelf: 'center',
          paddingHorizontal: 10,
        }}
        autoFocus
      />
      <Button onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </View>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ScreenA" component={ScreenA} />
        <Stack.Screen name="ScreenB" component={ScreenB} options={{
          headerShown: true,
          fullScreenGestureEnabled: false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
