import { ScrollView } from 'react-native';
import React from 'react';
import Colors from '../../../../shared/styling/Colors';
import LongText from '../../../../shared/LongText';

export default function ScrollViewNever() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      style={{ backgroundColor: Colors.RedLight80 }}>
      <LongText size="xl" />
    </ScrollView>
  );
}
