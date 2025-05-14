import React, { PropsWithChildren } from 'react';
import { Button, Text, View, ViewProps } from 'react-native';

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
  const [focusedTab, setFocusedTab] = React.useState(0);
  const selectNextTab = React.useCallback(() => {
    setFocusedTab(old => old + 1);
  }, [setFocusedTab]);

  console.log(`Render: focusedTab: ${focusedTab}`);

  return (
    <View style={{ flex: 1 }}>
      <BottomTabs tabBarBackgroundColor={'rgba(255, 255, 0, 0.5)'} tabBarBlurEffect={'dark'}>
        <BottomTabsScreen isFocused={focusedTab % 3 === 0}>
          <LayoutView style={{ backgroundColor: 'lightgreen' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Hello world from native bottom tab</Text>
              <Button title="Next tab" onPress={selectNextTab} />
            </View>
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen isFocused={focusedTab % 3 === 1}>
          <LayoutView style={{ backgroundColor: 'lightblue' }}>
            <Text>Tab2 world from native bottom tab</Text>
            <Button title="Next tab" onPress={selectNextTab} />
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen isFocused={focusedTab % 3 === 2}>
          <LayoutView style={{ backgroundColor: 'yellow' }}>
            <Text>Tab3 world from native bottom tab</Text>
            <Button title="Next tab" onPress={selectNextTab} />
          </LayoutView>
        </BottomTabsScreen>
      </BottomTabs>
    </View>
  );
}

export default App;
