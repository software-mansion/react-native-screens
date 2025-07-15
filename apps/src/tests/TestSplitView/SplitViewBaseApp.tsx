import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplitViewHost, SplitViewScreen } from 'react-native-screens';
import PressableWithFeedback from '../../shared/PressableWithFeedback';
import { Colors } from '../../shared/styling/Colors';

const TestButton = ({ setButtonState }) => {
  return (
    <PressableWithFeedback
      onPress={() => setButtonState('Pressed')}
      onPressIn={() => setButtonState('Pressed In')}
      onPressOut={() => setButtonState('Pressed Out')}
      style={styles.button}>
      <Text style={styles.text}>Touch me</Text>
    </PressableWithFeedback>
  )
}

const SplitViewBaseApp = () => {
  const [buttonState, setButtonState] = React.useState('Initial');
  const [buttonState2, setButtonState2] = React.useState('Initial');
  const [buttonState3, setButtonState3] = React.useState('Initial');
  const [buttonState4, setButtonState4] = React.useState('Initial');

  return (
    <SplitViewHost displayMode='secondaryOnly' presentsWithGesture={true} showSecondaryToggleButton={true} splitBehavior='tile'>
      <SplitViewScreen columnType='column'>
        <View style={[styles.container, { backgroundColor: Colors.RedDark100 }]}>
          <TestButton setButtonState={setButtonState} />
          {buttonState && (<Text style={styles.text}>Button State: {buttonState}</Text>)}
        </View>
      </SplitViewScreen>
      <SplitViewScreen columnType='column'>
        <View style={[styles.container, { backgroundColor: Colors.YellowDark100 }]}>
          <TestButton setButtonState={setButtonState2} />
          {buttonState2 && (<Text style={styles.text}>Button State: {buttonState2}</Text>)}
        </View>
      </SplitViewScreen>
      <SplitViewScreen columnType='column'>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <TestButton setButtonState={setButtonState3} />
          {buttonState3 && (<Text style={styles.text}>Button State: {buttonState3}</Text>)}
        </View>
      </SplitViewScreen>
      <SplitViewScreen columnType='inspector'>
        <View style={[styles.container, { backgroundColor: Colors.GreenDark100 }]}>
          <TestButton setButtonState={setButtonState4} />
          {buttonState4 && (<Text style={styles.text}>Button State: {buttonState4}</Text>)}
        </View>
      </SplitViewScreen>
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
