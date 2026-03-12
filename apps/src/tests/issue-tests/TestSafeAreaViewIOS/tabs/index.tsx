import React, { useState } from 'react';
import {
  TabsSAVExampleConfig,
  TabsSAVExampleContext,
} from './TabsSAVExampleContext';
import TabsComponent from './TabsComponent';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';

export default function TabsSAVExample() {
  const [exampleConfig, setExampleConfig] = useState<TabsSAVExampleConfig>({
    tabBarMinimizeBehavior: 'automatic',
    tabBarItemSystemItem: 'disabled',
    content: 'regularView',
    safeAreaTopEdge: true,
    safeAreaBottomEdge: true,
    safeAreaLeftEdge: true,
    safeAreaRightEdge: true,
  });

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <TabsSAVExampleContext.Provider
          value={{
            config: exampleConfig,
            setConfig: setExampleConfig,
          }}>
          <TabsComponent />
        </TabsSAVExampleContext.Provider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
