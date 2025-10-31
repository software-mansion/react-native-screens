import React from 'react';
import { View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    // In original repro SafeAreaView from `react-native` has been used here. 
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Open Modal"
        onPress={() => navigation.navigate('Modal')}
      />
    </View>
  );
}

function ModalScreen() {
  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    console.log('Modal width:', width);
  };
  return (
    <View style={{ flex: 1, width: '100%', alignSelf: 'center', paddingHorizontal: 16, backgroundColor: 'green' }} onLayout={onLayout}>
      <View style={{ flex: 1, backgroundColor: 'purple' }} />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
