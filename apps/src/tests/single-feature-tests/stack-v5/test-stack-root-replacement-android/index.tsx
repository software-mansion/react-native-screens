import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

// Drive the native host directly: the reference navigator forwards a pop of its
// root to its parent, which cannot reproduce replacing a single-screen stack.
function TestStackRootReplacementAndroid() {
  const nextKey = useRef(1);
  const [routes, setRoutes] = useState(['root-0']);
  const newKey = () => `screen-${nextKey.current++}`;
  const remove = (key: string) =>
    setRoutes(current => current.filter(route => route !== key));

  return (
    <Stack.Host>
      {routes.map(key => (
        <Stack.Screen
          key={key}
          screenKey={key}
          activityMode="attached"
          onNativeDismiss={remove}>
          <View style={styles.screen}>
            <Text testID="replacement-current">{key}</Text>
            <Button
              testID="replace-top"
              title="Replace top"
              onPress={() => {
                const replacement = newKey();
                setRoutes(current => [...current.slice(0, -1), replacement]);
              }}
            />
            <Button
              testID="push-detail"
              title="Push detail"
              onPress={() => {
                const detail = newKey();
                setRoutes(current => [...current, detail]);
              }}
            />
            <Button
              testID="reset-root"
              title="Replace entire history"
              onPress={() => setRoutes([newKey()])}
            />
            <Button
              testID="replace-with-pair"
              title="Replace history with two screens"
              onPress={() => setRoutes([newKey(), newKey()])}
            />
            <Button
              testID="pop-detail"
              title="Pop detail"
              disabled={routes.length === 1}
              onPress={() => remove(key)}
            />
          </View>
          <Stack.HeaderConfig title={key} />
        </Stack.Screen>
      ))}
    </Stack.Host>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', backgroundColor: 'white' },
});

export default createScenario(
  TestStackRootReplacementAndroid,
  scenarioDescription,
);
