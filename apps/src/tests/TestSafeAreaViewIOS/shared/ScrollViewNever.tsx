import { ScrollView } from 'react-native';
import LongText from './LongText';
import React from 'react';
import Colors from '../../../shared/styling/Colors';

export default function ScrollViewNever() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      style={{ backgroundColor: Colors.RedLight80 }}>
      <LongText />
    </ScrollView>
  );
}
