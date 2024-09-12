/**
 *
 * IMPORTANT! READ BEFORE TESTING!
 * Remember to switch windowSoftInputMode to `adjustPan` in AndroidManifest.xml file.
 *
 */

import React, { useLayoutEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HeaderButton } from '@react-navigation/elements';
type RootStackNavigatorParamsList = {
  Home: undefined;
  Details: undefined;
};
const Stack = createNativeStackNavigator();
const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackNavigatorParamsList>>();
  const onHandlePress = () => {
    navigation.navigate('Details');
  };
  return (
    <View>
      <Text>HomeScreen</Text>
      <View>
        <Button title="Go to Details" onPress={onHandlePress} />
      </View>
    </View>
  );
};
const DetailsScreen = () => {
  const [text, setText] = React.useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackNavigatorParamsList>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Detail Screen',
      headerRight: () => {
        if (text.length === 0) {
          return null;
        }
        return (
          <HeaderButton>
            <Text>X</Text>
          </HeaderButton>
        );
      },
    });
  }, [navigation, text]);
  const onHandlePress = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Text>RegisterScreen</Text>
      <View>
        <TextInput
          style={{ backgroundColor: 'grey', height: 40, borderColor: 'black' }}
          placeholder="Enter text"
          value={text}
          onChangeText={text => {
            setText(text);
          }}
        />
        <Button title="Go to Home" onPress={onHandlePress} />
        <Button title="Go to Details" onPress={onHandlePress} />
      </View>
    </View>
  );
};
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
