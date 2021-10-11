import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {SearchBarProps} from 'react-native-screens';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [isSearchBarVisible, setIsSearchBarVisible] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState('red');
  const [inputType, setInputType] = React.useState<'number' | 'text'>('number');
  const [text, setText] = React.useState('');
  React.useEffect(() => {
    const searchBar: SearchBarProps = {
      onChangeText: (e) => setText(e.nativeEvent.text),
      onTextSubmit: () => navigation.navigate('Second'),
      onFocus: () => setBackgroundColor('green'),
      onBlur: () => setBackgroundColor('red'),
      inputType,
      autoCapitalize: 'none'
    };
    navigation.setOptions({
      searchBar: isSearchBarVisible ? searchBar : undefined,
    });
  }, [isSearchBarVisible, inputType]);

  const toggleSearchBarButtonTitle = `${
    isSearchBarVisible ? 'Hide' : 'Show'
  } search bar`;

  const toggleInputTypeButtonTitle = `Change input type to ${
    inputType === 'number' ? 'text' : 'number'
  }`;
  return (
    <View style={{flex: 1, backgroundColor}}>
      <Button
        title={toggleSearchBarButtonTitle}
        onPress={() => setIsSearchBarVisible((prev) => !prev)}
      />
      <Button
        title={toggleInputTypeButtonTitle}
        onPress={() => setInputType((prev) => prev === 'number' ? 'text' : 'number')}
      />
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Text>{text}</Text>
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, backgroundColor: 'yellow'}}>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
