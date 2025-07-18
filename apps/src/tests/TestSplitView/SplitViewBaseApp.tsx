import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { Colors } from '../../shared/styling/Colors';

const SplitViewBaseApp = () => {
  const [buttonVisibility, setButtonVisibility] = React.useState('automatic');

  return (
    <SplitViewHost displayModeButtonVisibility={buttonVisibility} displayMode='twoBesideSecondary' splitBehavior='tile'>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <Text style={styles.text}>Primary column</Text>
        </View>
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.YellowDark100 }]}>
          <Text style={styles.text}>DisplayModeButtonVisibility demo</Text>
          <Button onPress={() => setButtonVisibility('always')} title='always' />
          <Button onPress={() => setButtonVisibility('automatic')} title='automatic' />
          <Button onPress={() => setButtonVisibility('never')} title='never' />
        </View>
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.RedDark100 }]}>
          <Text style={styles.text}>Secondary column</Text>
        </View>
      </SplitViewScreen.Column>
    </SplitViewHost>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 24
  },
  button: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BlueDark100
  }
})

export default SplitViewBaseApp;
