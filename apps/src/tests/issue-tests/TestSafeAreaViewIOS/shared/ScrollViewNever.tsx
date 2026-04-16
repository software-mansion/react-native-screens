import { ScrollView } from 'react-native';
import React from 'react';
import { Colors } from '@apps/shared/styling';
import LongText from '@apps/shared/LongText';

export default function ScrollViewNever() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="never"
      style={{ backgroundColor: Colors.RedLight80 }}>
      <LongText size="xl" />
    </ScrollView>
  );
}
