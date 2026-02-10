import { ScrollView } from 'react-native';
import React from 'react';
import Colors from '../../../../shared/styling/Colors';
import LongText from '../../../../shared/LongText';

export default function ScrollViewAutomatic() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: Colors.BlueLight80 }}>
      <LongText size="xl" />
    </ScrollView>
  );
}
