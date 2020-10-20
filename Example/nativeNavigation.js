import React from 'react';
import { TextInput, StyleSheet, Button, View, ScrollView } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const SomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.screen}>
      <Button
        onPress={() => navigation.push('Push')}
        title="Push"
      />
      <Button
        onPress={() => navigation.navigate('Modal')}
        title="Modal"
      />
      <Button onPress={() => navigation.pop()} title="Back" />
      <View style={styles.leftTop} />
      <View style={styles.bottomRight} />
    </ScrollView>
  );
}

const PushScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <TextInput placeholder="Hello" style={styles.textInput} />
      <Button
        onPress={() => navigation.goBack()}
        title="Go back"
      />
      <Button
        onPress={() => navigation.push('Push')}
        title="Push more"
      />
      <View style={styles.leftTop} />
      <View style={styles.bottomRight} />
    </View>
  );
}

const AppStack = createNativeStackNavigator();

const App = () => (
  <AppStack.Navigator screenProps={{ statusBarAnimation: 'fade' }}>
    <AppStack.Screen
      name="Some"
      component={SomeScreen}
      options={{
        title: 'Start',
        headerTintColor: 'black',
        statusBarStyle: 'auto',
      }}
    />
    <AppStack.Screen
      name="Push"
      component={PushScreen}
      options={{
        title: 'Pushed',
        headerStyle: { backgroundColor: '#3da4ab' },
        headerTintColor: 'black',
        statusBarHidden: true,
      }}
    />
    <AppStack.Screen
      name="Modal"
      component={PushScreen}
      options={{ stackPresentation: 'modal', statusBarStyle: 'light' }}
    />
  </AppStack.Navigator>
);

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 200,
    flex: 1,
    backgroundColor: 'white',
  },
  leftTop: {
    position: 'absolute',
    width: 80,
    height: 80,
    left: 0,
    top: 0,
    backgroundColor: 'red',
  },
  bottomRight: {
    position: 'absolute',
    width: 80,
    height: 80,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
  },
  modal: {
    position: 'absolute',
    left: 50,
    top: 50,
    right: 50,
    bottom: 50,
    backgroundColor: 'red',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    borderColor: 'black',
  },
});

export default App;
