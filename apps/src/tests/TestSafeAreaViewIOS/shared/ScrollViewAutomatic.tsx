import { ScrollView } from 'react-native';
import LongText from './LongText';
import React from 'react';
import Colors from '../../../shared/styling/Colors';

export default function ScrollViewAutomatic() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: Colors.BlueLight80 }}>
      <LongText />
    </ScrollView>
  );
}
