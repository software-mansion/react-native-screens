import React from 'react';
import {
  Button,
  NativeSyntheticEvent,
  Text,
  View,
  ViewProps,
} from 'react-native';

import {
  BottomTabs,
  BottomTabsScreen,
  enableFreeze,
} from 'react-native-screens';
import Colors from '../shared/styling/Colors';
import { NativeFocusChangeEvent } from 'react-native-screens/fabric/BottomTabsNativeComponent';

enableFreeze(true);

let gHeavyTabRender = false;
const gExperimentalControlNavigationStateInJS = false;

interface LayoutViewProps extends ViewProps {
  tabID?: number;
}

function someExtensiveComputation(n: number = 50000000): string {
  if (!gHeavyTabRender) {
    return '';
  }

  let a = 100;
  for (let i = 0; i < n; i++) {
    a += 1;
  }
  return a.toString();
}

function LayoutView(props: LayoutViewProps) {
  const { children, style, ...rest } = props;

  console.log(`LayoutView render; tabID: ${rest.tabID}`);
  someExtensiveComputation();

  return (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

interface TabContentViewProps extends ViewProps {
  selectNextTab: () => void;
  tabKey: string;
  message?: string;
}

function TabContentView(props: TabContentViewProps) {
  const { selectNextTab, tabKey, message, ...viewProps } = props;

  return (
    <View {...viewProps}>
      {message !== undefined && <Text>{message}</Text>}
      <Text>tabKey: {tabKey}</Text>
      <Button title="Next tab" onPress={selectNextTab} />
      <Button
        title="Toggle heavy render"
        onPress={() => {
          gHeavyTabRender = !gHeavyTabRender;
        }}
      />
    </View>
  );
}

function TabPlaceholder() {
  console.log('Placeholder render');
  return (
    <View
      style={[
        {
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Navy,
        },
      ]}
    />
  );
}

function App() {
  const [focusedTab, setFocusedTab] = React.useState(0);
  const selectNextTab = React.useCallback(() => {
    setFocusedTab(old => old + 1);
  }, [setFocusedTab]);

  console.log(`Render: focusedTab: ${focusedTab}`);

  // Pending state can be used to render placeholder for the time of transition.
  const [_, startTransition] = React.useTransition();

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      const tabKey = event.nativeEvent.tabKey;

      // Use `startTransition` only if the state is controlled in JS
      let transitionFn = gExperimentalControlNavigationStateInJS
        ? startTransition
        : (callback: () => void) => {
            callback();
          };
      transitionFn(() => {
        if (tabKey === 'Tab1') {
          setFocusedTab(0);
        } else if (tabKey === 'Tab2') {
          setFocusedTab(1);
        } else if (tabKey === 'Tab3') {
          setFocusedTab(2);
        } else {
          console.error(`Tab key: ${tabKey}`);
        }
      });
    },
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <BottomTabs
        tabBarBackgroundColor={Colors.NavyLight100}
        tabBarItemTitleFontSize={14}
        experimentalControlNavigationStateInJS={
          gExperimentalControlNavigationStateInJS
        }
        onNativeFocusChange={onNativeFocusChangeCallback}>
        <BottomTabsScreen
          isFocused={focusedTab % 3 === 0}
          badgeValue="1"
          badgeColor={Colors.NavyDark80}
          title="Tab1"
          tabKey="Tab1">
          <LayoutView style={{ backgroundColor: Colors.OffWhite }} tabID={0}>
            <TabContentView selectNextTab={selectNextTab} tabKey={'Tab1'} />
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen
          isFocused={focusedTab % 3 === 1}
          badgeValue="2"
          badgeColor={Colors.PurpleLight100}
          title="Tab2"
          tabKey="Tab2"
          placeholder={<TabPlaceholder />}>
          <LayoutView
            style={{ backgroundColor: Colors.PurpleLight80 }}
            tabID={1}>
            <TabContentView selectNextTab={selectNextTab} tabKey={'Tab2'} />
          </LayoutView>
        </BottomTabsScreen>
        <BottomTabsScreen
          isFocused={focusedTab % 3 === 2}
          badgeValue="3"
          badgeColor={Colors.YellowDark120}
          title="Tab3"
          tabKey="Tab3"
          titleFontSize={16}
          placeholder={<TabPlaceholder />}>
          <LayoutView
            style={{ backgroundColor: Colors.YellowDark80 }}
            tabID={2}>
            <TabContentView selectNextTab={selectNextTab} tabKey={'Tab3'} />
          </LayoutView>
        </BottomTabsScreen>
      </BottomTabs>
    </View>
  );
}

export default App;
