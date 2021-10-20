import * as React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
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
        <Stack.Screen name="Search" component={Second} options={{title: ''}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function SearchIconButton(props: {onPress: () => void}) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Image source={require('../assets/search_black.png')} />
    </TouchableOpacity>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useEffect(() => {
    function HeaderSearchButton() {
      return <SearchIconButton onPress={() => navigation.navigate('Search')} />;
    }
    navigation.setOptions({
      title: 'Home',
      headerRight: HeaderSearchButton,
      stackAnimation: 'none',
    });
  }, [navigation]);
  return <View style={{flex: 1, backgroundColor: '#FFF'}}></View>;
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    navigation.setOptions({
      title: '',
      searchBar: {
        autoFocus: true,
        onClose: () => navigation.navigate('First'),
        onChangeText: (e) => setText(e.nativeEvent.text),
      },
      stackAnimation: 'none',
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFF', padding: 12}}>
      <Text style={{fontSize: 24, fontWeight: '600', marginBottom: 12}}>
        Search Results
      </Text>
      <Text>{text}</Text>
    </View>
  );
}
