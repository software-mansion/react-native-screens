import React, { useState } from 'react';
import { Button, View } from 'react-native';
import Colors from '../../shared/styling/Colors';
import { TestBottomTabs } from '.';

export default function App() {
  const [index, setIndex] = useState(0);
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 100,
        backgroundColor: Colors.BlueLight40,
      }}>
      {index === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button title="Go to Bottom Tabs" onPress={() => setIndex(1)} />
        </View>
      ) : (
        <TestBottomTabs />
      )}
    </View>
  );
}
