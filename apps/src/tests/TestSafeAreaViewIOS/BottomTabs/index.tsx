import React, { useState } from 'react';
import {
  BottomTabsSAVExampleConfig,
  BottomTabsSAVExampleContext,
} from './BottomTabsSAVExampleContext';
import BottomTabsComponent from './BottomTabsComponent';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

export default function BottomTabsSAVExample() {
  const [exampleConfig, setExampleConfig] =
    useState<BottomTabsSAVExampleConfig>({
      tabBarMinimizeBehavior: 'automatic',
      tabBarItemSystemItem: 'disabled',
      content: 'regularView',
      safeAreaTopEdge: true,
      safeAreaBottomEdge: true,
      safeAreaLeftEdge: true,
      safeAreaRightEdge: true,
    });

  return (
    <BottomTabsSAVExampleContext.Provider
      value={{
        config: exampleConfig,
        setConfig: setExampleConfig,
      }}>
      <NavigationIndependentTree>
        <NavigationContainer>
          <BottomTabsComponent />
        </NavigationContainer>
      </NavigationIndependentTree>
    </BottomTabsSAVExampleContext.Provider>
  );
}
