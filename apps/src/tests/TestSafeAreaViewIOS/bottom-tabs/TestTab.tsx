import React, { useMemo } from 'react';
import { useBottomTabsSAVExampleContext } from './BottomTabsSAVExampleContext';
import { SafeAreaView } from 'react-native-screens/private';
import { mapContentStringToComponent } from '../shared';

export default function TestTab() {
  const { config } = useBottomTabsSAVExampleContext();

  let content = useMemo(
    () => mapContentStringToComponent(config.content),
    [config.content],
  );

  return (
    <SafeAreaView
      edges={{
        top: config.safeAreaTopEdge,
        bottom: config.safeAreaBottomEdge,
        left: config.safeAreaLeftEdge,
        right: config.safeAreaRightEdge,
      }}>
      {content}
    </SafeAreaView>
  );
}
