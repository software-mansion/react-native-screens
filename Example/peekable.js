import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PeekAndPop } from 'react-native-screens';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <PeekAndPop
          previewActions={[
            {
              type: 'destructive',
              caption: 'remove',
              action: () => console.warn('XXX'),
            },
            {
              type: 'destructive',
              caption: 'remove2',
              action: () => console.warn('UUU'),
            },
            {
              caption: 'group',
              group: [
                {
                  type: 'selected',
                  caption: 'selected',
                  action: () => console.warn('XXX'),
                },
                {
                  type: 'selected',
                  caption: 'selected2',
                  action: () => console.warn('UUU'),
                },
              ],
            },
          ]}
          onPop={() => console.warn('CX')}
          renderPreview={() => <Text>Inner</Text>}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'blue',
            }}>
            <Text>Presss me press me say that you press me</Text>
          </View>
        </PeekAndPop>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5ACFF',
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
