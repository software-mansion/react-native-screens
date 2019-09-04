import React from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  ScrollView,
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
      <ScrollView style={styles.screen}>
        <Button
          onPress={() => this.props.navigation.push('Push')}
          title="Push"
        />
        <Button
          onPress={() => this.props.navigation.push('Modal')}
          title="Modal"
        />
        <Button onPress={() => this.props.navigation.pop()} title="Back" />
        <View style={styles.leftTop} />
        <View style={styles.bottomRight} />
      </ScrollView>
    );
  }
}

class PushScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };
  render() {
    return (
      <ScrollView style={styles.screen}>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
        <Button
          onPress={() => this.props.navigation.push('Push')}
          title="Push more"
        />
        <View style={styles.leftTop} />
        <View style={styles.bottomRight} />
      </ScrollView>
    );
  }
}

const AppStack = createStackNavigator(
  {
    Some: {
      screen: SomeScreen,
      navigationOptions: () => ({
        title: 'Lol',
        // headerBackTitle: null,
        headerStyle: {
          // backgroundColor: 'transparent',
        },
        // translucent: true,
        // largeTitle: true,
      }),
    },
    Push: {
      screen: PushScreen,
      navigationOptions: {
        title: 'Wat?',
        // headerBackTitle: 'Yoo',
        // headerBackTitleStyle: {
        //   fontFamily: 'ChalkboardSE-Light',
        // },
        headerStyle: {
          // backgroundColor: 'green',
        },
        headerTintColor: 'black',
        // header: null,
        // translucent: true,
        // gestureEnabled: false,
      },
    },
  },
  {
    initialRouteName: 'Some',
    // headerMode: 'none',
    // transparentCard: true,
    // mode: 'modal',
  }
);

const App = createStackNavigator(
  {
    Root: { screen: AppStack },
    Modal: PushScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
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

export default createAppContainer(App);
