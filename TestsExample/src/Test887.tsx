import * as React from 'react';
import {
  Animated as RNAnimated,
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {useTransitionProgress} from 'react-native-screens';
import {useReanimatedTransitionProgress} from 'react-native-screens/reanimated';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

const NestedStack = createStackNavigator();

// Nested stack to check if transition progress values are passed properly through non native-stack navigators
function NestedFirst() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NestedFirst" component={First}/>
    </NestedStack.Navigator>
  )
}

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
  Third: undefined;
};
export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackAnimation: 'fade_from_bottom',
          // stackPresentation: 'transparentModal',
        }}>
        <Stack.Screen name="First" component={NestedFirst} />
        <Stack.Screen name="Second" component={Second} />
        <Stack.Screen
          name="Third"
          component={Dialog}
          options={{stackPresentation: 'modal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// checking if many components can call useProgress at the same time
function SiblingView() {
  const reaProgress = useReanimatedTransitionProgress();
  const sv = useDerivedValue(
    () =>
      (reaProgress.progress.value < 0.5
        ? reaProgress.progress.value * 50
        : (1 - reaProgress.progress.value) * 50) + 50,
  );
  const reaStyle = useAnimatedStyle(() => {
    return {
      width: sv.value,
      height: sv.value,
      backgroundColor: 'blue',
    };
  });

  const {progress} = useTransitionProgress();

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0, 1.0],
    extrapolate: 'clamp',
  });

  return (
     <>
      <Animated.View style={reaStyle} />
      <RNAnimated.View
        style={{opacity, height: 50, width: '100%', backgroundColor: 'green'}}
      />
    </>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
}) {
  // using progress from both Animated and Reanimated context in the same Screen
  const reaProgress = useReanimatedTransitionProgress();
  const sv = useDerivedValue(
    () =>
      (reaProgress.progress.value < 0.5
        ? reaProgress.progress.value * 50
        : (1 - reaProgress.progress.value) * 50) + 50,
  );
  const reaStyle = useAnimatedStyle(() => {
    return {
      width: sv.value,
      height: sv.value,
      backgroundColor: 'blue',
    };
  });

  const {progress} = useTransitionProgress();

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0, 1.0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{backgroundColor: 'red', flex: 1}}>
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Tap me for third screen"
        onPress={() => navigation.push('Third')}
      />
      <Animated.View style={reaStyle} />
      <SiblingView />
      <SiblingView />
      <RNAnimated.View
        style={{opacity, height: 50, width: '100%', backgroundColor: 'green'}}
      />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>;
}) {
  // using Animated.Value with the progress from context
  const {progress} = useTransitionProgress();

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0, 1.0],
    extrapolate: 'clamp',
  });

  // use to check that nativeDriver works correctly
  // React.useEffect(() => {
  //   const inter = setInterval(() => {
  //     let sum = 0;
  //     for(let i = 0; i<1e8; i++) {
  //       sum = sum + i;
  //     }
  //   }, 20);
  //   return () => clearInterval(inter);
  // })

  return (
    <View style={{backgroundColor: 'yellow', flex: 1}}>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.push('Second')}
      />
      <Button
        title="Tap me for third screen"
        onPress={() => navigation.push('Third')}
      />
      <RNAnimated.View
        style={{opacity, height: 50, backgroundColor: 'green'}}
      />
    </View>
  );
}

const Dialog = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Third'>;
}): JSX.Element => {
  // using Animated with the progress
  const {progress} = useTransitionProgress();
  const reaProgress = useReanimatedTransitionProgress();
  const sv = useDerivedValue(
    () =>
      (reaProgress.progress.value < 0.5
        ? reaProgress.progress.value * 50
        : (1 - reaProgress.progress.value) * 50) + 50,
  );
  const reaStyle = useAnimatedStyle(() => {
    return {
      width: sv.value,
      height: sv.value,
      backgroundColor: 'blue',
    };
  });

  const val = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.5, 0.1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.heading}>Hey! Sign up for our newsletter!</Text>
        <RNAnimated.View
          style={{
            width: 50,
            height: 50,
            opacity: val,
            backgroundColor: 'blue',
          }}
        />
        <Animated.View style={reaStyle} />
        <TouchableOpacity
          style={{...styles.button}}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Please no.</Text>
        </TouchableOpacity>
        <Button
          title="Tap me for third screen"
          onPress={() => navigation.push('Third')}
        />
        <Button
          title="Tap me for first screen"
          onPress={() => navigation.navigate('First')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000044',
  },
  wrapper: {
    width: Dimensions.get('screen').width - 40,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.0,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'dodgerblue',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
