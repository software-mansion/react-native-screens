import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';

export function Tab3() {
  return (
    <ScrollViewMarker style={{ flex: 1 }} scrollEdgeEffects={{ bottom: 'hard' }}>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          height: 'auto',
          gap: 15,
          paddingHorizontal: 30,
        }}>
        {[...Array(30).keys()].map(index => (
          <PressableWithFeedback
            key={index + 1}
            onPress={() => console.log(`Pressed #${index + 1}`)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}>
            <Text>Pressable #{index + 1}</Text>
          </PressableWithFeedback>
        ))}
      </ScrollView>
    </ScrollViewMarker>
  );
}
