import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Button,
  View,
  TextInput,
  Animated,
  Image,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';


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

const DetailsScreen = ({ navigation, route }) => {
  const animvalue = new Animated.Value(0);
  const rotation = animvalue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const [count, setCount] = useState(1);
  const [text, setText] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: `Details screen #${getIndex()}`,
    });
    Animated.loop(
      Animated.timing(animvalue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
    setInterval(() => setCount(count + 1 ), 1000);
  },[navigation]); 

  const getIndex = () => {
    return route.params && route.params.index ? route.params.index : 0;
  }

  const index = getIndex();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Background index={index} />
      <Button
        title="More details"
        onPress={() =>
          navigation.push('Details', {
          index: index + 1,
          })
        }
      />
      <TextInput
        placeholder="Hello"
        style={styles.textInput}
        onChangeText={(text) => setText(text)}
        text={text}
      />
      <Animated.View
        style={{
          transform: [
            {
            rotate: rotation,
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
