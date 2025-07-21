import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import PressableWithFeedback from '../../shared/PressableWithFeedback';
import { Colors } from '../../shared/styling/Colors';

const TestButton = ({ onPress }) => {
  return (
    <PressableWithFeedback
      onPress={onPress}
      style={styles.button}>
      <Text style={styles.text}>Touch me</Text>
    </PressableWithFeedback>
  )
}

const SplitViewBaseApp = () => {
  const [inspectorVisible, setInspectorVisible] = React.useState(false);

  const onInspectorHide = () => {
    setInspectorVisible(false);
  }

  return (
    <SplitViewHost onInspectorHide={onInspectorHide} displayMode='secondaryOnly' presentsWithGesture={true} showSecondaryToggleButton={true} splitBehavior='tile' showInspector={inspectorVisible}>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.RedDark100 }]} />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.YellowDark100 }]} />
      </SplitViewScreen.Column>
      <SplitViewScreen.Column>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <TestButton onPress={() => setInspectorVisible(prev => !prev)} />
          <Text style={styles.text}>Toggle inspector</Text>
        </View>
      </SplitViewScreen.Column>
      <SplitViewScreen.Inspector>
        <View style={[styles.container, { backgroundColor: Colors.GreenDark100 }]} />
      </SplitViewScreen.Inspector>
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
