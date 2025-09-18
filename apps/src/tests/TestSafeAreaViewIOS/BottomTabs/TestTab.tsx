import React from 'react';
import { useBottomTabsSAVExampleContext } from './BottomTabsSAVExampleContext';
import RegularView from '../shared/RegularView';
import ScrollViewNever from '../shared/ScrollViewNever';
import ScrollViewAutomatic from '../shared/ScrollViewAutomatic';
import BottomTabsSAVExample from '.';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-screens/private';
import StackV4SAVExample from '../StackV4';
import { mapContentStringToComponent } from '../shared';

export default function TestTab() {
  const { config } = useBottomTabsSAVExampleContext();

  let content = mapContentStringToComponent(config.content);

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
