import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

function HomeScreen({ navigation }: any) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Navigate to Details"
          onPress={() => navigation.navigate('Details')}
        />
        <Text>Home Screen</Text>
      </View>
    </ScrollView>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>DetailsScreen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{
            headerLargeTitle: true,
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Details"
          //options={{ headerBackButtonDisplayMode: 'minimal' }}
          options={{}}
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

