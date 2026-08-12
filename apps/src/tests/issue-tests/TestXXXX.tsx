import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen, ScreenStack } from 'react-native-screens';

export default function App() {
  const [flip, setFlip] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip((f) => !f);
      setCycle((c) => c + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const boxes = (prefix: string) => {
    const arr = Array.from({ length: 20 }, (_, i) => i);
    if (flip) {
      arr.reverse();
    }
    return arr.map((i) => (
      <View
        key={`${prefix}-${i}`}
        style={[styles.box, i % 2 === 0 ? styles.even : styles.odd]}>
        <Text>
          {prefix} {i}
        </Text>
      </View>
    ));
  };

  const screenA = (
    <Screen key="a" style={StyleSheet.absoluteFill} activityState={2}>
      <Text style={styles.title}>
        Screen A — cycle {cycle}, flip {String(flip)}
      </Text>
      {boxes('a')}
    </Screen>
  );
  const screenB = (
    <Screen key="b" style={StyleSheet.absoluteFill} activityState={2}>
      <Text style={styles.title}>
        Screen B — cycle {cycle}, flip {String(flip)}
      </Text>
      {boxes('b')}
    </Screen>
  );

  return (
    <ScreenStack style={styles.container}>
      {flip ? [screenB, screenA] : [screenA, screenB]}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 12,
    fontWeight: 'bold',
  },
  box: {
    height: 20,
    marginVertical: 2,
    marginHorizontal: 12,
  },
  even: {
    backgroundColor: 'skyblue',
  },
  odd: {
    backgroundColor: 'lightgreen',
  },
});
