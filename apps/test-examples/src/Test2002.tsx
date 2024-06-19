import * as React from 'react';
import { View, Text, Button, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }) {
  const scheme = useColorScheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('MyModal')}
        title="Open Modal"
      />
      <Button
        onPress={() => navigation.navigate('MyWorkingModal')}
        title="Open Working Modal"
      />
      <Text style={{ marginTop: 10 }}>current scheme is: {scheme}</Text>
    </View>
  );
}

function ModalScreen({ navigation }) {
  const scheme = useColorScheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
      <Text style={{ marginTop: 10 }}>current scheme is: {scheme}</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View>
      <Text>Details</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Details" component={DetailsScreen} />
          <RootStack.Screen
            name="MyWorkingModal"
            component={ModalScreen}
            options={{ presentation: 'formSheet' }}
          />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <RootStack.Screen name="MyModal" component={ModalScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
