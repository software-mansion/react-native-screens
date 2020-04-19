import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  TextInput,
  Animated,
  Image,
  requireNativeComponent,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

export const LifecycleAwareView = requireNativeComponent(
  'RNSLifecycleAwareView',
  null
);

const IMGS = [
  require('./img/dawid-zawila-628275-unsplash.jpg'),
  require('./img/dawid-zawila-715178-unsplash.jpg'),
  require('./img/janusz-maniak-143024-unsplash.jpg'),
  require('./img/janusz-maniak-272680-unsplash.jpg'),
];

const Background = ({ index }) => (
  <Image
    resizeMode="cover"
    source={IMGS[index % IMGS.length]}
    style={{
      opacity: 0.5,
      width: null,
      height: null,
      ...StyleSheet.absoluteFillObject,
    }}
  />
);

class DetailsScreen extends React.Component {
  animvalue = new Animated.Value(0);
  rotation = this.animvalue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  state = { count: 1, text: '' };

  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Details screen #${this.getIndex()}`,
    });
    Animated.loop(
      Animated.timing(this.animvalue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
    setInterval(() => this.setState({ count: this.state.count + 1 }), 500);
  }

  getIndex() {
    const { params } = this.props.route;
    return params && params.index ? params.index : 0;
  }

  render() {
    const index = this.getIndex();
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Background index={index} />
        <Button
          title="More details"
          onPress={() =>
            this.props.navigation.push('Details', {
              index: index + 1,
            })
          }
        />
        <TextInput
          placeholder="Hello"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ text })}
          text={this.state.text}
        />
        <Animated.View
          style={{
            transform: [
              {
                rotate: this.rotation,
              },
            ],
            marginTop: 20,
            borderColor: 'blue',
            borderWidth: 3,
            width: 20,
            height: 20,
          }}
        />
      </View>
    );
  }
}

const Stack = createStackNavigator();

const App = () => (
  <Stack.Navigator>
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
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
