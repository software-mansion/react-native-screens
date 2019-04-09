import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  View,
  TextInput,
  NativeModules,
  findNodeHandle,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Screen, ScreenContainer } from 'react-native-screens';

export class LazyTabs extends Component {
  state = {
    screens: ['azure'],
    active: 'azure',
  };
  goto(key) {
    let { screens } = this.state;
    if (screens.indexOf(key) === -1) {
      screens = [...screens, key];
    }
    this.setState({ active: key, screens });
  }
  renderScreen = (key, index) => {
    const active = key === this.state.active ? 1 : 0;
    return (
      <Screen style={StyleSheet.absoluteFill} key={key} active={active}>
        {this.props.renderScreen(key)}
      </Screen>
    );
  };
  render() {
    const screens = this.state.screens.map(this.renderScreen);
    return (
      <ScreenContainer style={styles.container}>{screens}</ScreenContainer>
    );
  }
}

class App extends Component {
  renderScreen = key => {
    const color = key;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextInput placeholder="Hello" style={styles.textInput} />
      </View>
    );
  };

  ref1 = React.createRef();
  ref2 = React.createRef();
  ref3 = React.createRef();
  ref4 = React.createRef();

  componentDidMount() {
    console.log(findNodeHandle(this.ref1.current));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            height: 100,
            zIndex: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            NativeModules.ScreensTransactions.perform(
              findNodeHandle(this.ref1.current),
              findNodeHandle(this.ref2.current),
              findNodeHandle(this.ref3.current),
              findNodeHandle(this.ref4.current)
            )
          }>
          <Text>TRANS</Text>
        </TouchableOpacity>
        <ScreenContainer style={styles.container}>
          <Screen
            ref={this.ref1}
            style={[StyleSheet.absoluteFill, { backgroundColor: 'red' }]}
            active={1}>
            <View
              style={{
                backgroundColor: 'yellow',
                left: 200,
                width: 100,
                height: 200,
                zIndex: 100,
              }}
              ref={this.ref3}
            />
          </Screen>

          <Screen
            ref={this.ref2}
            style={[StyleSheet.absoluteFill, { backgroundColor: 'blue' }]}
            active={0}>
            <View
              style={{
                backgroundColor: 'green',
                left: 100,
                width: 140,
                height: 300,
                zIndex: 100,
              }}
              ref={this.ref4}
            />
          </Screen>
        </ScreenContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabbar: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderColor: '#ddd',
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
