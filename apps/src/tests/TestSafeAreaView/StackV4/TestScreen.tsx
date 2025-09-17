import React, { useEffect } from 'react';
import { useStackV4SAVExampleContext } from './StackV4SAVExampleContext';
import RegularView from '../shared/RegularView';
import ScrollViewNever from '../shared/ScrollViewNever';
import ScrollViewAutomatic from '../shared/ScrollViewAutomatic';
import BottomTabsSAVExample from '../BottomTabs';
import StackV4SAVExample, { StackNavigationProp } from '.';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-screens/private';

export default function TestScreen({ navigation }: StackNavigationProp) {
  const { config } = useStackV4SAVExampleContext();

  useEffect(() => {
    navigation.setOptions({
      headerLargeTitle: config.headerLargeTitle,
      headerTransparent: config.headerTransparent,
      headerShown: config.headerShown,
      headerSearchBarOptions:
        config.headerSearchBar !== 'disabled'
          ? {
              placement: config.headerSearchBar,
            }
          : undefined,
    });
  }, [config, navigation]);

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
