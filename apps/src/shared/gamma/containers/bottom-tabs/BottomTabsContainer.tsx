import React from 'react';
import ConfigWrapperContext from './ConfigWrapperContext';
import { BottomTabs, BottomTabsScreen } from 'react-native-screens';
import { Colors } from '../../../styling/Colors';
import type { BottomTabsScreenProps } from 'react-native-screens/components/BottomTabsScreen';
import type { NativeSyntheticEvent } from 'react-native';
import type { NativeFocusChangeEvent } from 'react-native-screens/fabric/BottomTabsNativeComponent';

export interface TabConfiguration {
  tabScreenProps: BottomTabsScreenProps;
  contentViewRenderFn?: (selectNextTab?: () => void) => React.ReactNode;
}

export interface BottomTabsContainerProps {
  tabConfigs: TabConfiguration[];
}

export function BottomTabsContainer(props: BottomTabsContainerProps) {
  // Currently assumes controlled bottom tabs
  console.info('BottomTabsContainer render');

  const totalTabCount = props.tabConfigs.length;

  const [focusedTabKey, setFocusedTabKey] = React.useState<string>(() => {
    console.log('BottomTabsContainer focusedStateKey initial state computed');

    if (props.tabConfigs.length === 0) {
      throw new Error('There must be at least one tab defined');
    }

    const maybeUserRequestedFocusedTab = props.tabConfigs.find(
      tabConfig => tabConfig.tabScreenProps.isFocused === true,
    )?.tabScreenProps.tabKey;

    if (maybeUserRequestedFocusedTab != null) {
      return maybeUserRequestedFocusedTab;
    }

    // Default to first tab
    return props.tabConfigs[0].tabScreenProps.tabKey;
  });

  const selectNextTab = React.useCallback(() => {
    setFocusedTabKey(currentTabKey => {
      const tabNumberAsString = currentTabKey.slice(3);
      const tabNumber = Number.parseInt(tabNumberAsString, 10);
      const tabIndex = tabNumber - 1; // tabs are numbered starting from 1
      const nextTabIndex = (tabIndex + 1) % totalTabCount;
      const nextTabKey = `Tab${nextTabIndex + 1}`;
      return nextTabKey;
    });
  }, [totalTabCount]);

  const configWrapper = React.useContext(ConfigWrapperContext);

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      const tabKey = event.nativeEvent.tabKey;

      // Use `startTransition` only if the state is controlled in JS
      // const transitionFn = !configWrapper.config.controlledBottomTabs
      //   ? startTransition
      //   : (callback: () => void) => {
      //       callback();
      //     };

      // Please note that the `useTransition` hook can not be used here,
      // because it intruduces additional renders, which lead
      // to blank screens / placeholders being visible (on slower render)
      // for a few frames!
      const transitionFn = React.startTransition;
      // const transitionFn = (callback: () => void) => {
      //   callback();
      // };

      transitionFn(() => {
        console.info(`Starting transition to ${tabKey}`);
        setFocusedTabKey(tabKey);
      });
    },
    [],
  );

  return (
    <BottomTabs
      onNativeFocusChange={onNativeFocusChangeCallback}

      tabBarBackgroundColor={Colors.NavyLight100}
      tabBarItemActivityIndicatorColor={Colors.GreenLight40}
      tabBarTintColor={Colors.YellowLight100}
      tabBarItemBadgeBackgroundColor={Colors.GreenDark100}
      tabBarItemIconColor={Colors.BlueLight100}
      tabBarItemTitleFontColor={Colors.BlueLight40}
      tabBarItemIconColorActive={Colors.GreenLight100}
      tabBarItemTitleFontColorActive={Colors.GreenLight40}
      tabBarItemTitleFontSize={10}
      tabBarItemTitleFontSizeActive={15}
      tabBarItemRippleColor={Colors.WhiteTransparentDark}
      tabBarItemTitleFontFamily='monospace'
      tabBarItemTitleFontStyle='italic'
      tabBarItemTitleFontWeight="700"

      experimentalControlNavigationStateInJS={
        configWrapper.config.controlledBottomTabs
      }>
      {props.tabConfigs.map(tabConfig => {
        const tabKey = tabConfig.tabScreenProps.tabKey;
        const isFocused = tabConfig.tabScreenProps.tabKey === focusedTabKey;
        console.info(
          `BottomTabsContainer map to component -> ${tabKey} ${
            isFocused ? '(focused)' : ''
          }`,
        );
        return (
          <BottomTabsScreen
            key={tabKey}
            {...tabConfig.tabScreenProps}
            isFocused={isFocused} // notice that the value passed by user is overriden here!
          >
            {tabConfig.contentViewRenderFn?.(selectNextTab)}
          </BottomTabsScreen>
        );
      })}
    </BottomTabs>
  );
}
