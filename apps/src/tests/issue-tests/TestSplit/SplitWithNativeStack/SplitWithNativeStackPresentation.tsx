import React from 'react';
import { SplitView, SplitScreen } from 'react-native-screens/experimental';
import { NativeStackNavigatorComponent, type ScreenOneProps } from '../helpers';
import { StyleSheet, Text, View } from 'react-native';
import PressableWithFeedback from '../../../../shared/PressableWithFeedback';
import Colors from '../../../../shared/styling/Colors';
import { SplitBaseConfig } from '../helpers/types';

const ScreenOne = ({ navigation }: ScreenOneProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>ScreenOne</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('ScreenTwo')}>
      <Text style={styles.text}>Show full screen modal</Text>
    </PressableWithFeedback>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('ScreenThree')}>
      <Text style={styles.text}>Show form sheet</Text>
    </PressableWithFeedback>
  </View>
)

const ScreenTwo = () => (
  <View style={styles.container}>
    <Text style={styles.text}>ScreenTwo</Text>
  </View>
)

const ScreenThree = () => (
  <View style={[styles.container, { backgroundColor: Colors.BlueDark100, opacity: 0.5 }]}>
    <Text style={styles.text}>ScreenOne</Text>
  </View>
)

export const SplitWithNativeStackPresentation = ({ splitBaseConfig }: { splitBaseConfig: SplitBaseConfig }) => {
  return (
    <SplitView {...splitBaseConfig}>
      <SplitView.Primary>
        <SplitScreen screenKey="primary" activityMode="attached">
          <NativeStackNavigatorComponent />
        </SplitScreen>
      </SplitView.Primary>
      <SplitView.Supplementary>
        <SplitScreen screenKey="supplementary" activityMode="attached">
          <NativeStackNavigatorComponent />
        </SplitScreen>
      </SplitView.Supplementary>
      <SplitView.Secondary>
        <SplitScreen screenKey="secondary" activityMode="attached">
          <NativeStackNavigatorComponent
            CustomScreenOne={ScreenOne}
            customScreenOneName='ScreenOne'
            CustomScreenTwo={ScreenTwo}
            customScreenTwoName='ScreenTwo'
            customScreenTwoNavigationOptions={{ presentation: 'fullScreenModal' }}
            CustomScreenThree={ScreenThree}
            customScreenThreeName='ScreenThree'
            customScreenThreeNavigationOptions={{ presentation: 'formSheet' }}
          />
        </SplitScreen>
      </SplitView.Secondary>
    </SplitView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24
  },
  pressable: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.BlueDark140
  }
})

