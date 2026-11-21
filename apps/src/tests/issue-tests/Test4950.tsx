import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';

// Android: needs a display cutout at the bottom of the window. On an emulator,
// enable Developer options > Simulate a display with a cutout > Tall cutout,
// turn off auto-rotate and rotate the device 180°:
//   adb shell settings put system accelerometer_rotation 0
//   adb shell settings put system user_rotation 2
// By default the header shouldn't grow by the cutout height. With the switch
// on, the header passes `disableBottomInsetApplication: false` and applies the
// bottom inset again.

export default function Test4950() {
  const [applyBottomInset, setApplyBottomInset] = useState(false);

  return (
    <ScreenStack style={styles.container}>
      <ScreenStackItem
        screenId="home"
        headerConfig={{
          title: 'Test4950',
          backgroundColor: '#f4511e',
          color: '#fff',
          ...(applyBottomInset && { disableBottomInsetApplication: false }),
        }}>
        <View style={styles.screen}>
          <View style={styles.row}>
            <Text>disableBottomInsetApplication: false</Text>
            <Switch
              value={applyBottomInset}
              onValueChange={setApplyBottomInset}
            />
          </View>
        </View>
      </ScreenStackItem>
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
