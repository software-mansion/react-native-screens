import * as React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
} from 'react-native';

import CommonSheetContent from '../components/CommonSheetContent';
import { NavPropObj } from '../types';

export default function SheetScreenWithTextInput({ navigation }: NavPropObj) {
  const [textValue, setTextValue] = React.useState('text input');

  return (
    <View style={styles.centeredView}>
      <TextInput
        style={[styles.bordered, styles.keyboardTriggerTextInput]}
        value={textValue}
        onChangeText={text => setTextValue(text)}
      />
      <CommonSheetContent />
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: 20,
    width: 20,
    // backgroundColor: 'red',
  },
  containerView: {
    flex: 1,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'firebrick',
    // flex: 1,
  },
  absoluteFillNoBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    // bottom: 0,
    backgroundColor: 'firebrick',
  },
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'teal',
  },
  bordered: {
    borderColor: 'black',
    borderWidth: 2,
  },
  keyboardTriggerTextInput: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    marginTop: 10,
  },
});
