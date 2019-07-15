import React from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  TextInput,
  Animated,
  Image,
  requireNativeComponent,
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import createStackNavigator from './createStackNavigator';

class SomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.screen}>
        <Button
          onPress={() => this.props.navigation.push('Push')}
          title="Push"
        />
      </View>
    );
  }
}

class PushScreen extends React.Component {
  render() {
    return (
      <View style={styles.screen}>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
        <Button
          onPress={() => this.props.navigation.push('Push')}
          title="Push more"
        />
      </View>
    );
  }
}

const App = createStackNavigator(
  {
    Some: {
      screen: SomeScreen,
      navigationOptions: () => ({
        title: 'Lol',
        headerBackTitle: null,
        largeTitle: true,
      }),
    },
    Push: {
      screen: PushScreen,
      navigationOptions: {
        title: 'Wat?',
        headerBackTitle: 'Yoo',
        headerBackTitleFontFamily: 'ChalkboardSE-Light',
        headerTintColor: 'black',
      },
    },
  },
  {
    initialRouteName: 'Some',
    // transparentCard: true,
    // mode: 'modal',
  }
);

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
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

export default createAppContainer(App);
