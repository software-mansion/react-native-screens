import React, { useEffect, useMemo } from 'react';
import { useStackV4SAVExampleContext } from './StackV4SAVExampleContext';
import { StackNavigationProp } from '.';
import { SafeAreaView } from 'react-native-screens/experimental';
import { mapContentStringToComponent } from '../shared';

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
