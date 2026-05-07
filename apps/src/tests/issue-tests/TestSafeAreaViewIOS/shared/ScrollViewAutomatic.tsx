import { ScrollView } from 'react-native';
import React from 'react';
import { Colors } from '@apps/shared/styling';
import LongText from '@apps/shared/LongText';

export default function ScrollViewAutomatic() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: Colors.BlueLight80 }}>
      <LongText size="xl" />
    </ScrollView>
  );
}
