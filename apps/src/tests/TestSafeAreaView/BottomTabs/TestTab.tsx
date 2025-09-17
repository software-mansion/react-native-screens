import React from 'react';
import { useBottomTabsSAVExampleContext } from './BottomTabsSAVExampleContext';
import RegularView from '../shared/RegularView';
import ScrollViewNever from '../shared/ScrollViewNever';
import ScrollViewAutomatic from '../shared/ScrollViewAutomatic';
import BottomTabsSAVExample from '.';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-screens/private';
import StackV4SAVExample from '../StackV4';

export default function TestTab() {
  const { config } = useBottomTabsSAVExampleContext();

  let content;
  switch (config.content) {
    case 'regularView':
      content = <RegularView />;
      break;
    case 'scrollViewNever':
      content = <ScrollViewNever />;
      break;
    case 'scrollViewAutomatic':
      content = <ScrollViewAutomatic />;
      break;
    case 'tabs':
      content = <BottomTabsSAVExample />;
      break;
    case 'stack':
      content = <StackV4SAVExample />;
      break;
    default:
      content = <Text>Unknown test case.</Text>;
      break;
  }

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
