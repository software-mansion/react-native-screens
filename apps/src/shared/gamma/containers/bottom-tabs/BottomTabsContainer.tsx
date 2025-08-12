import React from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import {
  BottomTabs,
  BottomTabsScreen,
  BottomTabsScreenProps,
  NativeFocusChangeEvent,
} from 'react-native-screens';
import { Colors } from '../../../styling/Colors';
import ConfigWrapperContext from './ConfigWrapperContext';

export interface TabConfiguration {
  tabScreenProps: BottomTabsScreenProps;
  component: React.ComponentType;
}

export interface BottomTabsContainerProps {
  tabConfigs: TabConfiguration[];
}

export function BottomTabsContainer(props: BottomTabsContainerProps) {
  // Currently assumes controlled bottom tabs
  console.info('BottomTabsContainer render');

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
      tabBarItemActiveIndicatorColor={Colors.GreenLight40}
      tabBarItemActiveIndicatorEnabled={true}
      tabBarTintColor={Colors.YellowLight100}
      tabBarItemBadgeBackgroundColor={Colors.GreenDark100}
      tabBarItemIconColor={Colors.BlueLight100}
      tabBarItemTitleFontColor={Colors.BlueLight40}
      tabBarItemIconColorActive={Colors.GreenLight100}
      tabBarItemTitleFontColorActive={Colors.GreenLight40}
      tabBarItemTitleFontSize={10}
      tabBarItemTitleFontSizeActive={15}
      tabBarItemRippleColor={Colors.WhiteTransparentDark}
      tabBarItemTitleFontFamily="monospace"
      tabBarItemTitleFontStyle="italic"
      tabBarItemTitleFontWeight="700"
      tabBarItemLabelVisibilityMode="auto"
      tabBarMinimizeBehavior="onScrollDown"
      experimentalControlNavigationStateInJS={
        configWrapper.config.controlledBottomTabs
      }>
      {props.tabConfigs.map(tabConfig => {
        const tabKey = tabConfig.tabScreenProps.tabKey;
        const isFocused = tabConfig.tabScreenProps.tabKey === focusedTabKey;
        const ContentComponent = tabConfig.component;
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
            <ContentComponent/>
          </BottomTabsScreen>
        );
      })}
    </BottomTabs>
  );
}
