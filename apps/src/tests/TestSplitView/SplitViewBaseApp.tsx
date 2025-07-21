import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import { Colors } from '../../shared/styling/Colors';

const SplitViewBaseApp = () => {
  const [lastSplitViewEvent, setLastSplitViewEvent] = React.useState<string>();

  const onCollapse = () => setLastSplitViewEvent('onCollapse');
  const onExpand = () => setLastSplitViewEvent('onExpand');

  return (
    <SplitViewHost onCollapse={onCollapse} onExpand={onExpand}>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.RedDark100 }]} />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.YellowDark100 }]} />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <Text style={styles.text}>{`SplitView event received: ${lastSplitViewEvent}`}</Text>
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
