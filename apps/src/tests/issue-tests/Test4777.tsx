import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4777
//
// `RNSScreenComponentDescriptor::adopt` used to call `setSize` on every clone
// of a Screen, which always marks its Yoga node dirty. Every commit clones the
// path to the root, so every commit re-ran layout and pixel-grid rounding over
// the whole tree, even when nothing layout-related changed.
//
// Both sources of commits below change no layout: scrolling (ScrollView
// content offset state updates) and a color that changes every frame. Profile
// while scrolling or with "Animate color" on (Instruments / Perfetto): with the
// fix, `RootShadowNode::layout` and `roundLayoutResultsToPixelGrid` should not
// show up for these commits.

const ROW_COUNT = 500;
const COLORS = ['#f4cccc', '#d9ead3', '#cfe2f3', '#fff2cc'];

function Rows() {
  return (
    <>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderBottomWidth: 1,
            borderColor: '#ddd',
          }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#ccc',
            }}
          />
          <Text>Row {index}</Text>
        </View>
      ))}
    </>
  );
}

function AnimatedColorBox() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let id = requestAnimationFrame(function tick() {
      setFrame(value => value + 1);
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <View
      style={{
        height: 40,
        backgroundColor: COLORS[Math.floor(frame / 10) % COLORS.length],
      }}
    />
  );
}

export default function App() {
  const [showList, setShowList] = useState(false);
  const [animateColor, setAnimateColor] = useState(false);
  const pop = () => setShowList(false);

  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen key="home" activityState={2} isNativeStack>
        <ScreenStackHeaderConfig title="Home" />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Button title="Push long list" onPress={() => setShowList(true)} />
        </View>
      </Screen>
      {showList && (
        <Screen key="list" activityState={2} isNativeStack onDismissed={pop}>
          <ScreenStackHeaderConfig title="Long list" />
          <Button
            title={animateColor ? 'Stop animating color' : 'Animate color'}
            onPress={() => setAnimateColor(value => !value)}
          />
          {animateColor && <AnimatedColorBox />}
          <ScrollView style={{ flex: 1 }}>
            <Rows />
          </ScrollView>
        </Screen>
      )}
    </ScreenStack>
  );
}
