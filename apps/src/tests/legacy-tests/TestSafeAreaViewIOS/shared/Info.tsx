import React from 'react';
import { Text } from 'react-native';

export default function Info() {
  return (
    <Text style={{ fontStyle: 'italic', marginTop: 20 }}>
      You can change base of this test to Stackv4, BottomTabs or SplitView by
      modifying TestSafeAreaView/index.tsx.
    </Text>
  );
}
