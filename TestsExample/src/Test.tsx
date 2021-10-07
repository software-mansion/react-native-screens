import * as React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {SearchBarProps} from 'react-native-screens';

const Stack = createNativeStackNavigator();

const searchBar: SearchBarProps = {
  onChangeText: (e) => console.log(e.nativeEvent.text)
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            searchBar,
          }}
        />
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
  const toggleSearchBarButtonTitle = `${
    isSearchBarVisible ? 'Hide' : 'Show'
  } search bar`;
  React.useEffect(() => {
    navigation.setOptions({
      searchBar: isSearchBarVisible ? searchBar : undefined,
    });
  }, [isSearchBarVisible]);
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Button
        title={toggleSearchBarButtonTitle}
        onPress={() => setIsSearchBarVisible((prev) => !prev)}
      />
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
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
