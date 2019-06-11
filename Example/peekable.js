import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';
import { PeekAndPop, PeekableView, Screen } from 'react-native-screens';

const IMGS = [
  require('./navigation/img/dawid-zawila-628275-unsplash.jpg'),
  require('./navigation/img/dawid-zawila-715178-unsplash.jpg'),
  require('./navigation/img/janusz-maniak-143024-unsplash.jpg'),
  require('./navigation/img/janusz-maniak-272680-unsplash.jpg'),
];

export class PeekablePreview extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: '100%', height: '80%' }}
          source={this.props.navigation.getParam('source')}
        />
        <Button
          onPress={() => this.props.navigation.navigate('Peekable')}
          title="Go back!"
        />
      </View>
    );
  }
}

class App extends Component {
  renderPeekable = source => (
    <PeekableView
      renderPreview={() => <Image source={source} />}
      key={source}
      onPeek={() => console.log('onPeek')}
      onPop={() =>
        this.props.navigation.navigate('PeekablePreview', { source })
      }
      onDisappear={() => console.log('onDisappear')}
      previewActions={[
        {
          type: 'destructive',
          caption: 'remove',
          action: () => console.warn('1'),
        },
        {
          type: 'destructive',
          caption: 'remove2',
          action: () => console.warn('2'),
        },
        {
          caption: 'group',
          group: [
            {
              type: 'selected',
              caption: 'selected',
              action: () => console.warn('3'),
            },
            {
              type: 'selected',
              caption: 'selected2',
              action: () => console.warn('4'),
            },
          ],
        },
      ]}>
      <Image
        resizeMode="cover"
        source={source}
        style={{
          width: 130,
          height: 130,
        }}
      />
    </PeekableView>
  );
  render() {
    return (
      <View style={styles.container}>
        <Screen style={styles.container}>
          {IMGS.map(i => this.renderPeekable(i))}
        </Screen>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b0b0c',
    justifyContent: 'center',
    alignItems: 'center',
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
