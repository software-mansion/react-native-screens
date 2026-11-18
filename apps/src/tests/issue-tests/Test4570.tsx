import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type DetailAnimation = 'none' | 'layout' | 'spinner';

type Routes = { Home: undefined; Detail: { animation: DetailAnimation } };

const Stack = createNativeStackNavigator<Routes>();

// Restarts a layout transition before the previous one ends, so Reanimated
// mounts synchronously on the UI thread every frame, including the frame of
// the pop.
function LayoutAnimationTicker() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setWide(value => !value), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      layout={LinearTransition.duration(700)}
      style={[styles.ticker, { width: wide ? '90%' : '20%' }]}
    />
  );
}

// Animates a transform on the UI thread every frame, like the spinner in #4570.
function Spinner() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return <Animated.View style={[styles.spinner, animatedStyle]} />;
}

function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  return (
    <View style={styles.home}>
      <Text>
        Push the detail screen and pop it. The orange content must stay visible
        until the exit animation ends, with and without a running Reanimated
        animation.
      </Text>
      <Button
        testID="test4570-push-detail"
        title="Push detail"
        onPress={() => navigation.navigate('Detail', { animation: 'none' })}
      />
      <Button
        testID="test4570-push-detail-with-layout-animation"
        title="Push detail with layout animation"
        onPress={() => navigation.navigate('Detail', { animation: 'layout' })}
      />
      <Button
        testID="test4570-push-detail-with-spinner"
        title="Push detail with spinner"
        onPress={() => navigation.navigate('Detail', { animation: 'spinner' })}
      />
    </View>
  );
}

function Detail({
  navigation,
  route,
}: NativeStackScreenProps<Routes, 'Detail'>) {
  return (
    <View style={styles.detail}>
      {route.params.animation === 'layout' && <LayoutAnimationTicker />}
      {route.params.animation === 'spinner' && <Spinner />}
      <Text style={styles.detailText}>DETAIL CONTENT</Text>
      <Button
        testID="test4570-pop"
        title="Pop"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: '#cfe8ff',
  },
  ticker: {
    height: 24,
    backgroundColor: '#1f6feb',
  },
  detail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    backgroundColor: '#ff8c00',
  },
  spinner: {
    width: 48,
    height: 48,
    backgroundColor: '#1f6feb',
  },
  detailText: {
    fontSize: 32,
    fontWeight: '700',
  },
});
