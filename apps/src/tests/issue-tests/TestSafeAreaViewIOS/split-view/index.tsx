import React, { useState } from 'react';
import {
  ColumnConfig,
  SplitViewSAVExampleConfig,
  SplitViewSAVExampleContext,
} from './SplitViewSAVExampleContext';
import { NavigationIndependentTree } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import {
  SplitView,
  SplitScreen,
} from 'react-native-screens/experimental';
import ConfigColumn from './ConfigColumn';
import { mapContentStringToComponent } from '../shared';
import { SafeAreaView } from 'react-native-screens/experimental';

const defaultColumnConfig: ColumnConfig = {
  safeAreaTopEdge: true,
  safeAreaBottomEdge: true,
  safeAreaLeftEdge: true,
  safeAreaRightEdge: true,
  content: 'regularView',
};

export default function SplitViewSAVExample({
  configColumnIndex,
}: {
  configColumnIndex: 1 | 2 | 3 | 4;
}) {
  const [config, setConfig] = useState<SplitViewSAVExampleConfig>({
    column1: defaultColumnConfig,
    column2: defaultColumnConfig,
    column3: defaultColumnConfig,
    column4: defaultColumnConfig,
    showInspector: configColumnIndex === 4,
  });

  const renderColumnContent = (columnConfig: ColumnConfig) => (
    <SafeAreaView
      edges={{
        top: columnConfig.safeAreaTopEdge,
        bottom: columnConfig.safeAreaBottomEdge,
        left: columnConfig.safeAreaLeftEdge,
        right: columnConfig.safeAreaRightEdge,
      }}>
      {mapContentStringToComponent(columnConfig.content)}
    </SafeAreaView>
  );

  return (
    <SplitViewSAVExampleContext.Provider
      value={{
        config,
        setConfig,
      }}>
      <NavigationIndependentTree>
        <NavigationContainer>
          <SplitView
            preferredDisplayMode="twoBesideSecondary"
            preferredSplitBehavior="tile"
            showInspector={config.showInspector}>
            <SplitView.Primary>
              <SplitScreen screenKey="primary" activityMode="attached">
                {configColumnIndex !== 1 ? (
                  renderColumnContent(config.column1)
                ) : (
                  <ConfigColumn configColumnIndex={configColumnIndex} />
                )}
              </SplitScreen>
            </SplitView.Primary>
            <SplitView.Supplementary>
              <SplitScreen screenKey="supplementary" activityMode="attached">
                {configColumnIndex !== 2 ? (
                  renderColumnContent(config.column2)
                ) : (
                  <ConfigColumn configColumnIndex={configColumnIndex} />
                )}
              </SplitScreen>
            </SplitView.Supplementary>
            <SplitView.Secondary>
              <SplitScreen screenKey="secondary" activityMode="attached">
                {configColumnIndex !== 3 ? (
                  renderColumnContent(config.column3)
                ) : (
                  <ConfigColumn configColumnIndex={configColumnIndex} />
                )}
              </SplitScreen>
            </SplitView.Secondary>
            <SplitView.Inspector>
              <SplitScreen screenKey="inspector" activityMode="attached">
                {configColumnIndex !== 4 ? (
                  renderColumnContent(config.column4)
                ) : (
                  <ConfigColumn configColumnIndex={configColumnIndex} />
                )}
              </SplitScreen>
            </SplitView.Inspector>
          </SplitView>
        </NavigationContainer>
      </NavigationIndependentTree>
    </SplitViewSAVExampleContext.Provider>
  );
}
