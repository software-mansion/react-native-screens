import React from 'react';
import {
  View,
  StyleSheet,
  I18nManager,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { Button } from '../shared';
import Animated, {
  SharedTransition,
  SharedTransitionType,
  withSpring,
} from 'react-native-reanimated';

type StackParamList = {
  Main: undefined;
  ScreenA: undefined;
  ScreenB: undefined;
  ScreenC: undefined;
  ScreenD: undefined;
};

// const transition = SharedTransition.duration(300).custom(values => {
//   'worklet';
//   return {
//     width: withSpring(values.targetWidth),
//     height: withSpring(values.targetHeight),
//     originX: withSpring(values.targetOriginX),
//     originY: withSpring(values.targetOriginY),
//   };
// });
// .progressAnimation((values, progress) => {
//   'worklet';
//   const getValue = (
//     progress: number,
//     target: number,
//     current: number
//   ): number => {
//     return progress * (target - current) + current;
//   };
//   return {
//     width: getValue(progress, values.targetWidth, values.currentWidth),
//     height: getValue(progress, values.targetHeight, values.currentHeight),
//     originX: getValue(progress, values.targetOriginX, values.currentOriginX),
//     originY: getValue(progress, values.targetOriginY, values.currentOriginY),
//   };
// })
// .defaultTransitionType(SharedTransitionType.ANIMATION);

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenA'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Text style={styles.header}>Revisit core memories</Text>
    <View style={styles.row}>
      <Animated.View
        style={[styles.box, styles.boxA]}
        sharedTransitionTag="screenA"
        // sharedTransitionStyle={transition}
      >
        <Pressable
          onPress={() => navigation.navigate('ScreenA')}
          style={styles.pressable}>
          <Text style={styles.header}>ScreenA</Text>
        </Pressable>
      </Animated.View>
      <View style={[styles.box, styles.boxB]}>
        <Pressable>
          <Text style={styles.header}>ScreenA</Text>
        </Pressable>
      </View>
    </View>
    <View style={styles.row}>
      <View style={[styles.box, styles.boxC]}>
        <Pressable>
          <Text style={styles.header}>ScreenA</Text>
        </Pressable>
      </View>
      <View style={[styles.box, styles.boxD]}>
        <Pressable>
          <Text style={styles.header}>ScreenA</Text>
        </Pressable>
      </View>
    </View>
  </View>
);

interface ScreenBProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenA'>;
}

const ScreenA = ({ navigation }: ScreenBProps): JSX.Element => (
  <Animated.View
    style={{ ...styles.container, backgroundColor: '#C49FFE' }}
    sharedTransitionTag="screenA"
    // sharedTransitionStyle={transition}
  >
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </Animated.View>
);

interface ScreenBProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenB'>;
}

const ScreenB = ({ navigation }: ScreenBProps): JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: '#6FCEF5' }}>
    <Button title="Go ScreenC" onPress={() => navigation.navigate('ScreenC')} />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      // stackAnimation: 'fade',
    }}>
    <Stack.Screen name="Main" component={MainScreen} />
    <Stack.Screen
      name="ScreenA"
      component={ScreenA}
      // options={{ goBackGesture: 'twoDimensionalSwipe' }}
    />
    <Stack.Screen
      name="ScreenB"
      component={ScreenB}
      options={{
        // stackAnimation: 'slide_from_bottom',
        goBackGesture: 'swipeRight',
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232736',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 10,
    color: '#EEF0FF',
  },
  box: {
    height: 250,
    width: Dimensions.get('window').width / 2 - 20,
    margin: 10,
    borderRadius: 12,
  },
  boxA: {
    backgroundColor: '#C49FFE',
  },
  boxB: {
    backgroundColor: '#6FCEF5',
  },
  boxC: {
    backgroundColor: '#FF8B88',
  },
  boxD: {
    backgroundColor: '#7ADEAD',
  },
  row: {
    flexDirection: 'row',
  },
  pressable: {
    flex: 1,
  },
});

export default App;
