import * as React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';

import { NavProp } from '../types';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Second({ navigation }: NavProp) {
  const navigateToFirstCallback = () => {
    console.log('Navigate to first callback called');
    navigation.navigate('First');
  };

  return (
    <View style={{ backgroundColor: 'darksalmon', flex: 1 }}>
      <Button
        title="Open the sheet"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <Button
        title="Open the sheet with ScrollView"
        onPress={() => navigation.navigate('SheetScreenWithScrollView')}
      />
      <Button
        title="Open the Third screen"
        onPress={() => navigation.replace('Third')}
      />
      <Button
        title="Open ModalScreen"
        onPress={() => navigation.navigate('ModalScreen')}
      />
      <Button
        title="Go back to first screen"
        onPress={navigateToFirstCallback}
      />
      <TouchableOpacity
        style={{ backgroundColor: 'goldenrod' }}
        onPress={() => console.log('GestureHandler button clicked')}>
        <Text>GestureHandler driven button</Text>
      </TouchableOpacity>
    </View>
  );
}
