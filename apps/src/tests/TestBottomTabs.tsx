import React from 'react';
import { Button, Text, View, ViewProps } from 'react-native';

import { BottomTabs, BottomTabsScreen, enableFreeze } from 'react-native-screens';
import Colors from '../shared/styling/Colors';

enableFreeze(true);

interface LayoutViewProps extends ViewProps {
  tabID: number;
}

function LayoutView(props: LayoutViewProps) {
  const { children, style, ...rest } = props;

  console.log(`LayoutView render; tabID: ${rest.tabID}`);

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
      <BottomTabs tabBarBackgroundColor={Colors.NavyLight100}>
        <BottomTabsScreen isFocused={focusedTab % 3 === 0} badgeValue="1" badgeColor={Colors.NavyDark80} title="Tab1">
          <LayoutView style={{ backgroundColor: Colors.OffWhite }} tabID={0}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Hello world from native bottom tab</Text>
              <Button title="Next tab" onPress={selectNextTab} />
            </View>
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen isFocused={focusedTab % 3 === 1} badgeValue="2" badgeColor={Colors.PurpleLight100} title="Tab2">
          <LayoutView style={{ backgroundColor: Colors.PurpleLight80 }} tabID={1}>
            <Text>Tab2 world from native bottom tab</Text>
            <Button title="Next tab" onPress={selectNextTab} />
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen isFocused={focusedTab % 3 === 2} badgeValue="3" badgeColor={Colors.YellowDark120} title="Tab3">
          <LayoutView style={{ backgroundColor: Colors.YellowDark80 }} tabID={2}>
            <Text>Tab3 world from native bottom tab</Text>
            <Button title="Next tab" onPress={selectNextTab} />
          </LayoutView>
        </BottomTabsScreen>
      </BottomTabs>
    </View>
  );
}

export default App;
