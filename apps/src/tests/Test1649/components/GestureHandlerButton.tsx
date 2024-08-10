import * as React from 'react';
import {
  Text,
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';

export default function GestureHandlerButton() {
  const [color, setColor] = React.useState('goldenrod');

  const toggleColor = React.useCallback(function() {
    setColor(oldColor => oldColor === 'goldenrod' ? 'green' : 'goldenrod');
  }, [setColor]);


  return (
    <TouchableOpacity
      style={{ backgroundColor: color, alignSelf: 'center', width: '90%', marginVertical: 10, paddingVertical: 5, paddingHorizontal: 30, borderRadius: 10, borderColor: 'black', borderWidth: 2 }}
      onPress={() => {
        console.log('GestureHandler button clicked')
        toggleColor();
      }}>
      <Text>GestureHandler driven button</Text>
    </TouchableOpacity>
  );
}

