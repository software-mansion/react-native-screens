import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

// Repro for the Android pop "empty screen" flash: when Reanimated has
// pending operations at the moment a pop commits, its frame callback
// flushes the deleting mount batch synchronously on the UI thread
// (NodesManager.onAnimationFrame -> performOperations ->
// FabricUIManager.scheduleMountItem), which used to beat the posted
// startRemovalTransition. The exit animation then played on an empty,
// background-colored screen. The spinner below keeps such operations
// flowing; pop while it animates and watch the outgoing screen.

type StackParamList = {
  Main: undefined;
  Detail: undefined;
};

const MainScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}): React.JSX.Element => (
  <View style={[styles.container, styles.mainBackground]}>
    <Button title="Go to detail" onPress={() => navigation.navigate('Detail')} />
  </View>
);

const DetailScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Detail'>;
}): React.JSX.Element => {
  const angle = useSharedValue(0);
  useFrameCallback(frameInfo => {
    const dt = frameInfo.timeSincePreviousFrame ?? 0;
    angle.value = (angle.value + (dt / 1500) * 360) % 360;
  });
  const spinner = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));
  return (
    <View style={[styles.container, styles.detailBackground]}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Text style={styles.detailText}>DETAIL CONTENT</Text>
      <Animated.View style={[styles.square, spinner]} />
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  mainBackground: {
    backgroundColor: 'moccasin',
  },
  detailBackground: {
    backgroundColor: 'thistle',
  },
  detailText: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 100,
  },
  square: {
    width: 60,
    height: 60,
    backgroundColor: 'black',
    alignSelf: 'center',
    marginTop: 40,
  },
});

export default App;
