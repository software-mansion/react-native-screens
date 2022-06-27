/* eslint-disable react/display-name */
import * as React from 'react';
import {Button, StyleSheet, View, Text} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackPresentation: 'modal',
          headerRight: () => <View style={styles.headerView} />,
          headerTitleStyle: {
            color: 'cyan',
          },
          headerShown: true,
        }}>
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
  return (
    <Button
      title="Tap me for the second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [hidden, setHidden] = React.useState(false);
  const [text, setText] = React.useState('');
  return (
    <>
      <Button
      title="Tap me for the first screen"
      onPress={() => navigation.navigate('First')} />
      <Text>{text}</Text>
      <Button
        title="Change text"
        onPress={() => setText(Math.random().toString())} />
      <Button
        title="Hide header"
        onPress={() => {
          navigation.setOptions({headerShown: hidden});
          setHidden(!hidden);
      }}/>
    </>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
  },
});
