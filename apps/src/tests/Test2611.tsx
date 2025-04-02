import { ScrollView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const margin = useHeaderHeight();

  return (
    <ScrollView style={{
      marginTop: margin,
    }}>
      <Text style={{textAlign: "center"}}>focus and then cancel to see if position updates</Text>
    </ScrollView>
  );
}

function RootStack() {
  return (
    <Stack.Navigator>
     <Stack.Screen name="InitialScreen" component={HomeScreen} options={{
       headerSearchBarOptions: {},
     }} />
   </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
