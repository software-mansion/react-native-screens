import React, { PropsWithChildren } from 'react';
import { Text, View, ViewProps } from 'react-native';

import { BottomTabs, BottomTabsScreen } from 'react-native-screens';

function LayoutView(props: PropsWithChildren<ViewProps>) {
  const { children, style, ...rest } = props;

  return (
    <View style={[{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }, style]} {...rest}>
      {children}
    </View>
  );
}

function App() {
  return (
    <View style={{ flex: 1 }}>
      <BottomTabs tabBarBackgroundColor={'rgba(255, 255, 0, 0.5)'} tabBarBlurEffect={'dark'}>
        <BottomTabsScreen>
          <LayoutView style={{ backgroundColor: 'lightgreen' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Hello world from native bottom tab</Text>
            </View>
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen>
          <LayoutView style={{ backgroundColor: 'lightblue' }}>
            <Text>Tab2 world from native bottom tab</Text>
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen>
          <LayoutView style={{ backgroundColor: 'yellow' }}>
            <Text>Tab3 world from native bottom tab</Text>
          </LayoutView>
        </BottomTabsScreen>
      </BottomTabs>
    </View>
  );
}

export default App;
