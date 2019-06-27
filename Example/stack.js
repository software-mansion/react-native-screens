import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  View,
  TextInput,
  Animated,
  Easing,
  requireNativeComponent,
} from 'react-native';
import { Screen, ScreenContainer } from 'react-native-screens';

export const ScreenStack = requireNativeComponent('RNSScreenStack', null);

const COLORS = ['azure', 'pink', 'cyan'];

export class Stack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stack: ['azure'],
      transitioning: 0,
    };
  }
  push(key) {
    this.setState({ stack: [...this.state.stack, key], transitioning: 1 });
  }
  pop() {
    this.setState({
      transitioning: 0,
      stack: this.state.stack.slice(0, -1),
    });
  }
  remove(index) {
    this.setState({
      stack: this.state.stack.filter((v, idx) => idx !== index),
    });
  }
  renderScreen = (key, index) => {
    let style = StyleSheet.absoluteFill;
    const { stack, transitioning } = this.state;
    const active =
      index === stack.length - 1 ||
      (transitioning !== 0 && index === stack.length - 2);
    return (
      <Screen style={style} key={key} active={1}>
        {this.props.renderScreen(key)}
      </Screen>
    );
  };
  render() {
    const screens = this.state.stack.map(this.renderScreen);
    return <ScreenStack style={styles.container}>{screens}</ScreenStack>;
  }
}

class Apper extends Component {
  renderScreen = key => {
    const index = COLORS.indexOf(key);
    const color = key;
    const pop = index > 0 ? () => this.stack.pop() : null;
    const push = index < 2 ? () => this.stack.push(COLORS[index + 1]) : null;
    const remove = index > 1 ? () => this.stack.remove(1) : null;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          margin: index * 40,
        }}>
        {pop && <Button title="Pop" onPress={pop} />}
        {push && <Button title="Push" onPress={push} />}
        {remove && <Button title="Remove middle screen" onPress={remove} />}
        <TextInput placeholder="Hello" style={styles.textInput} />
        <View style={{ height: 100, backgroundColor: 'red', width: '70%' }} />
      </View>
    );
  };
  render() {
    return (
      <Stack
        ref={stack => (this.stack = stack)}
        renderScreen={this.renderScreen}
      />
    );
  }
}

const App = () => (
  <View style={StyleSheet.absoluteFill}>
    <Apper />
    <View
      style={{
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: 'red',
        right: 0,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
