import * as React from 'react';
import {
  Button,
  ButtonProps,
  StyleSheet,
  View,
} from 'react-native';

import { NavPropObj } from '../types';
import GestureHandlerButton from '../components/GestureHandlerButton';

function BorderedButton({ title, onPress }: ButtonProps) {
  return (
      <View style={[styles.buttonContainer]}>
        <Button
          title={title}
          onPress={onPress}
        />
      </View>
  );
}

export default function Second({ navigation }: NavPropObj) {
  return (
    <View style={{ backgroundColor: 'darksalmon', flex: 1 }}>
      <BorderedButton
        title="Navigate to sheet"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <BorderedButton
        title="Push sheet"
        onPress={() => navigation.push('SheetScreen')}
      />
      <BorderedButton
        title="Navigate Sheet w/ ScrollView"
        onPress={() => navigation.navigate('SheetScreenWithScrollView')}
      />
      <BorderedButton
        title="Navigate Third"
        onPress={() => navigation.navigate('Third')}
      />
      <BorderedButton
        title="Navigate ModalScreen"
        onPress={() => navigation.navigate('ModalScreen')}
      />
      <BorderedButton
        title="Navigate NS"
        onPress={() => navigation.navigate('NestedStack')}
      />
      <BorderedButton
        title="PopTo First"
        onPress={() => navigation.popTo("First")}
      />
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

