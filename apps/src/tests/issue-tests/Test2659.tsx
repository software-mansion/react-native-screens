import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useTransitionProgress } from 'react-native-screens';
import { Button } from '@apps/shared';

// iOS: open the sheet and wait until it settles. Tap "Reset", then drag
// the sheet down by its content, hold it for a moment, and drag it back up so
// the dismissal is cancelled.
//
// The sheet's content is a ScrollView that fits the sheet, so UIKit drags the
// sheet while the ScrollView keeps the run loop in UITrackingRunLoopMode.
//
// Expected: the bar follows the finger, and "Updates while dragging" keeps
// counting.
// Bug: the transition-progress display link does not fire during event
// tracking. The bar stays full and "Updates while dragging" stays at 0 while
// the sheet follows the finger.

type ParamList = {
  Home: undefined;
  Sheet: undefined;
};

const Stack = createNativeStackNavigator<ParamList>();

function HomeScreen({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Button title="Open sheet" onPress={() => navigation.navigate('Sheet')} />
    </View>
  );
}

function SheetScreen() {
  const { progress } = useTransitionProgress();
  const isDraggingRef = useRef(false);
  const updatesRef = useRef(0);
  const [updates, setUpdates] = useState(0);

  useEffect(() => {
    const id = progress.addListener(() => {
      if (isDraggingRef.current) {
        updatesRef.current += 1;
      }
    });
    const interval = setInterval(() => setUpdates(updatesRef.current), 200);
    return () => {
      progress.removeListener(id);
      clearInterval(interval);
    };
  }, [progress]);

  const resetUpdates = useCallback(() => {
    updatesRef.current = 0;
    setUpdates(0);
  }, []);

  return (
    <ScrollView
      bounces={false}
      onScrollBeginDrag={() => {
        isDraggingRef.current = true;
      }}
      onScrollEndDrag={() => {
        isDraggingRef.current = false;
      }}>
      <View style={styles.sheet}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.bar,
              {
                transform: [
                  {
                    scaleX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.001, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <Text style={styles.text}>Updates while dragging: {updates}</Text>
        <Button title="Reset" onPress={resetUpdates} />
      </View>
    </ScrollView>
  );
}

export default function Test2659() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Sheet"
          component={SheetScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.7],
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    padding: 24,
    gap: 8,
  },
  track: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ddd',
    overflow: 'hidden',
  },
  bar: {
    height: 16,
    width: '100%',
    backgroundColor: '#2a9d8f',
    transformOrigin: 'left',
  },
  text: {
    fontSize: 18,
  },
});
