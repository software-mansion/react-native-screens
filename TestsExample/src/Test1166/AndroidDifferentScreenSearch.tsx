import * as React from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import {ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{stackAnimation: 'none'}}>
      <Stack.Screen name="First" component={First} />
      <Stack.Screen name="Search" component={Second} options={{title: ''}} />
    </Stack.Navigator>
  );
}

function SearchIconButton(props: {onPress: () => void}) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Image source={require('../../assets/search_black.png')} />
    </TouchableOpacity>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useLayoutEffect(() => {
    function HeaderSearchButton() {
      return <SearchIconButton onPress={() => navigation.navigate('Search')} />;
    }
    navigation.setOptions({
      title: 'Home',
      headerRight: HeaderSearchButton,
      stackAnimation: 'none',
    });
  }, [navigation]);
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [text, setText] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      searchBar: {
        autoCapitalize: 'none',
        autoFocus: true,
        onClose: () => navigation.navigate('First'),
        onChangeText: (e) => setText(e.nativeEvent.text),
        barTintColor: text,
      },
      stackAnimation: 'none',
    });
  }, [navigation, text]);

  return (
    <View style={{flex: 1, backgroundColor: '#FFF', padding: 12}}>
      <Text style={{fontSize: 24, fontWeight: '600', marginBottom: 12}}>
        Search Results
      </Text>
      <Text>{text}</Text>
    </View>
  );
}
