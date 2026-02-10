import PressableWithFeedback from '../../../../shared/PressableWithFeedback';
import React from 'react';
import { Platform, ScrollView, Text } from 'react-native';
import { useBottomTabBarHeight } from 'react-native-screens';

export function Tab3() {
  const tabBarHeight = useBottomTabBarHeight();
  // Android native tabs are drawn above content, so we offset the list bottom
  // by the reported tab bar height to keep the last item reachable.
  const bottomOffset = Platform.OS === 'android' ? Math.max(tabBarHeight, 0) : 0;

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        height: 'auto',
        gap: 15,
        paddingHorizontal: 30,
        paddingBottom: bottomOffset,
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
  );
}
