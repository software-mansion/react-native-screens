import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{stackAnimation: 'none'}}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Search"
          component={Second}
          options={{title: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useEffect(() => {
    function HeaderSearchButton() {
      return <Button title="S" onPress={() => navigation.navigate('Search')} />;
    }
    navigation.setOptions({
      title: 'Home',
      headerRight: HeaderSearchButton,
      stackAnimation: 'none'
    });
  }, [navigation]);
  return <View style={{flex: 1, backgroundColor: '#FFF'}}></View>;
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useEffect(() => {
    navigation.setOptions({
      title:'',
      searchBar: {
        autoFocus: true,
        onClose: () => navigation.navigate('First'),
      },
      stackAnimation: 'none'
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Text>Search Results</Text>
    </View>
  );
}
