import React from 'react';
import { View } from 'react-native';
import { Colors } from '../../../../shared/styling/Colors';

export function TabPlaceholder() {
  console.info('TabPlaceholder render');
  return (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Navy,
        },
      ]}
    />
  );
}
