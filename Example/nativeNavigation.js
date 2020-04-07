import React from 'react';
import { TextInput, StyleSheet, Button, View, ScrollView } from 'react-native';
import createNativeStackNavigator from 'react-native-cool-modals/createNativeStackNavigator';

let key = 1;

class PushScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };
  render() {
    return (
      <View style={[StyleSheet.absoluteFillObject]}>
        <ScrollView>
          <TextInput placeholder="Hello" style={styles.textInput} />
          <Button
            onPress={() =>
              this.props.navigation.navigate({
                routeName: 'Root',
                key: key++,
                params: { customStack: false },
              })
            }
            title="Push more"
          />
          <Button
            onPress={() =>
              this.props.navigation.navigate({
                routeName: 'Root',
                key: key++,
                params: { customStack: true },
              })
            }
            title="Push custom"
          />
          <View style={styles.leftTop} />
          <View style={styles.bottomRight} />
        </ScrollView>
      </View>
    );
  }
}

const App = createNativeStackNavigator(
  {
    Root: {
      screen: PushScreen,
      navigationOptions: ({
        navigation: {
          state: { params },
        },
      }) => ({
        customStack: !!params?.customStack,
        // topOffset: 100,
        // showDragIndicator: true,
      }),
    },
    Modal: {
      screen: PushScreen,
    },
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

export default App;
