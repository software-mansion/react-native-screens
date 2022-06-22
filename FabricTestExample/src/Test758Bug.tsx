import * as React from 'react';
import {Button, NativeSyntheticEvent, ScrollView} from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';
import {SearchBarProps} from 'react-native-screens';

const AppStack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerLargeTitle: true,
          headerTranslucent: true,
        }}>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen name="Second" component={Second} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}: NativeStackScreenProps<ParamListBase>) {
  // React.useLayoutEffect(() => {
  //   // navigation.setOptions({
  //   //   searchBar: searchBarOptions,
  //   // });
  // }, [navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </ScrollView>
  );
}

function Second({navigation}: {navigation: NavigationProp<ParamListBase>}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </ScrollView>
  );
}
