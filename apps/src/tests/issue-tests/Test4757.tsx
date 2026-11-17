// Native stack with an opaque header inside a container that moves vertically, crossing the status bar area.
// Every button moves the container by changing its frame (`top`), except "transform (native driver)", which only
// changes the transform, so the insets stay as they were (control case).
//
// Check, both while the container moves and after it stops:
// - header shown: red (the screen's `contentStyle` background) is never visible, the "Content top" bar sits
//   right below the header and the header background covers the part of the status bar that overlaps the
//   container,
// - header hidden (content wrapped in a top-edge `SafeAreaView`): red fills exactly the part of the status bar
//   that overlaps the container, the "Content top" bar starts at the status bar's bottom edge, or at the top of
//   the container once it is below the status bar.
import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, Button, Easing, StyleSheet, Text, View } from 'react-native';
import Reanimated, {
  Easing as ReanimatedEasing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-screens/experimental';
import { Colors } from '@apps/shared/styling';

const Stack = createNativeStackNavigator();

const DISTANCE = 150;
const DURATION = 3000;
const STEP = 10;

type Controls = {
  headerShown: boolean;
  toggleHeader: () => void;
  toggleTransform: () => void;
  toggleJsTop: () => void;
  toggleReanimatedTop: () => void;
  stepTop: (delta: number) => void;
};

const ControlsContext = createContext<Controls | null>(null);

function useControls() {
  const controls = useContext(ControlsContext);
  if (controls == null) {
    throw new Error('useControls has to be used within ControlsContext');
  }
  return controls;
}

function toggleTarget(target: React.RefObject<number>) {
  target.current = target.current === 0 ? DISTANCE : 0;
  return target.current;
}

function Screen() {
  const controls = useControls();

  const content = (
    <View style={styles.content}>
      <Text style={styles.contentTop}>Content top</Text>
      <Button
        title="transform (native driver)"
        onPress={controls.toggleTransform}
      />
      <Button title="top (JS driver)" onPress={controls.toggleJsTop} />
      <Button title="top (Reanimated)" onPress={controls.toggleReanimatedTop} />
      <View style={styles.row}>
        <Button
          title={`top -${STEP}`}
          onPress={() => controls.stepTop(-STEP)}
        />
        <Button title={`top +${STEP}`} onPress={() => controls.stepTop(STEP)} />
      </View>
      <Button
        title={controls.headerShown ? 'Hide header' : 'Show header'}
        onPress={controls.toggleHeader}
      />
    </View>
  );

  if (controls.headerShown) {
    return content;
  }
  return (
    <SafeAreaView edges={{ top: true }} style={styles.fill}>
      {content}
    </SafeAreaView>
  );
}

export default function App() {
  const [headerShown, setHeaderShown] = useState(true);
  const [stepTop, setStepTop] = useState(0);

  const transform = useRef(new Animated.Value(0)).current;
  const transformTarget = useRef(0);
  const jsTop = useRef(new Animated.Value(0)).current;
  const jsTopTarget = useRef(0);
  const reanimatedTop = useSharedValue(0);
  const reanimatedTopTarget = useRef(0);
  const reanimatedStyle = useAnimatedStyle(() => ({
    top: reanimatedTop.value,
  }));

  const controls: Controls = {
    headerShown,
    toggleHeader: () => setHeaderShown(prev => !prev),
    toggleTransform: () =>
      Animated.timing(transform, {
        toValue: toggleTarget(transformTarget),
        duration: DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(),
    toggleJsTop: () =>
      Animated.timing(jsTop, {
        toValue: toggleTarget(jsTopTarget),
        duration: DURATION,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(),
    toggleReanimatedTop: () => {
      reanimatedTop.value = withTiming(toggleTarget(reanimatedTopTarget), {
        duration: DURATION,
        easing: ReanimatedEasing.linear,
      });
    },
    stepTop: delta => setStepTop(prev => Math.max(0, prev + delta)),
  };

  return (
    <ControlsContext.Provider value={controls}>
      <NavigationContainer>
        <View style={styles.background}>
          <Animated.View
            style={[styles.layer, { transform: [{ translateY: transform }] }]}>
            <Animated.View style={[styles.layer, { top: jsTop }]}>
              <Reanimated.View style={[styles.layer, reanimatedStyle]}>
                <View style={[styles.layer, { top: stepTop }]}>
                  <Stack.Navigator
                    screenOptions={{
                      contentStyle: { backgroundColor: Colors.RedLight100 },
                    }}>
                    <Stack.Screen
                      name="Screen"
                      component={Screen}
                      options={{ headerShown }}
                    />
                  </Stack.Navigator>
                </View>
              </Reanimated.View>
            </Animated.View>
          </Animated.View>
        </View>
      </NavigationContainer>
    </ControlsContext.Provider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.NavyLight40,
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: Colors.White,
  },
  contentTop: {
    alignSelf: 'stretch',
    padding: 4,
    backgroundColor: Colors.NavyLight100,
    color: Colors.White,
  },
  row: {
    flexDirection: 'row',
  },
});
