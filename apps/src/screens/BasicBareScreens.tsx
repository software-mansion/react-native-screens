import React from 'react';
import { useState } from 'react';
import { Button } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';

export default function BasicBareScreens() {
  const [secondShown, setSecondShown] = useState(false);

  return (
    <ScreenStack>
      <ScreenStackItem screenId="1" activityState={2}>
        <Button title="Go to screen 2" onPress={() => setSecondShown(true)} />
      </ScreenStackItem>
      {secondShown && (
        <ScreenStackItem screenId="2" activityState={2}>
          <Button title="Go back" onPress={() => setSecondShown(false)} />
        </ScreenStackItem>
      )}
    </ScreenStack>
  );
}
