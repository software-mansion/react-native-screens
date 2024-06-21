import * as React from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native';

import { NavProp } from '../types';
import GestureHandlerButton from '../components/GestureHandlerButton';

export default function Second({ navigation }: NavProp) {
  return (
    <View style={{ backgroundColor: 'darksalmon', flex: 1 }}>
      <View style={[styles.buttonContainer]}>
        <Button
          title="Navigate to sheet"
          onPress={() => navigation.navigate('SheetScreen')}
        />
      </View>
      <View style={[styles.buttonContainer]}>
        <Button
          title="Push sheet"
          onPress={() => navigation.push('SheetScreen')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Open the sheet with ScrollView"
          onPress={() => navigation.navigate('SheetScreenWithScrollView')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Open the Third screen"
          onPress={() => navigation.navigate('Third')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Open ModalScreen"
          onPress={() => navigation.navigate('ModalScreen')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Go back to first screen"
          onPress={() => navigation.popTo("First")}
        />
      </View>
      <GestureHandlerButton />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderTopColor: 'black',
    borderTopWidth: 1,
  }
});
