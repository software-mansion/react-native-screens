import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  ScreenStack,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
  ScreenStackItem,
} from 'react-native-screens';

// https://github.com/software-mansion/react-native-screens/issues/4811 (iOS)
//
// Press "Start". Without the fix the app crashes within a few seconds with
// "Collection <__NSArrayM> was mutated while being enumerated".
//
// `updateHeaderStateInShadowTreeInContextOfNavigationBar:` loops over `reactSubviews`.
// A header item that was just mounted sends its frame to the shadow tree synchronously,
// and that can mount the next pending commit. Here the left and right items toggle at
// different rates, so that commit adds or removes a header subview during the loop.
// Fast enumeration only notices it when it moves on to the next element, so the title
// is placed after the right item.

function HeaderItem() {
  return <View style={styles.item} />;
}

export default function App() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      setTick(t => t + 1);
      timer = setTimeout(loop, 0);
    };
    loop();
    return () => clearTimeout(timer);
  }, [running]);

  return (
    <ScreenStack style={styles.stack}>
      <ScreenStackItem
        screenId="home"
        headerConfig={{
          children: (
            <>
              {tick % 2 === 0 && (
                <ScreenStackHeaderLeftView>
                  <HeaderItem />
                </ScreenStackHeaderLeftView>
              )}
              {tick % 3 !== 0 && (
                <ScreenStackHeaderRightView>
                  <HeaderItem />
                </ScreenStackHeaderRightView>
              )}
              <ScreenStackHeaderCenterView>
                <HeaderItem />
              </ScreenStackHeaderCenterView>
            </>
          ),
        }}>
        <View style={styles.container}>
          <Button
            title={running ? 'Stop' : 'Start'}
            onPress={() => setRunning(r => !r)}
          />
          <Text>Updates: {tick}</Text>
        </View>
      </ScreenStackItem>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  stack: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  item: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f2b8b5',
  },
});
