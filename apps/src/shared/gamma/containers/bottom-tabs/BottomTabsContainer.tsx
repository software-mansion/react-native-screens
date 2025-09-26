import React from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import {
  BottomTabs,
  BottomTabsProps,
  BottomTabsScreen,
  BottomTabsScreenProps,
  NativeFocusChangeEvent,
} from 'react-native-screens';
import ConfigWrapperContext from './ConfigWrapperContext';

export interface TabConfiguration {
  tabScreenProps: BottomTabsScreenProps;
  component: React.ComponentType;
}

// Currently assumes controlled bottom tabs
export type BottomTabsContainerProps = Omit<BottomTabsProps, 'experimentalControlNavigationStateInJS' | 'onNativeFocusChange'> & { tabConfigs: TabConfiguration[]; }

export function BottomTabsContainer(props: BottomTabsContainerProps) {
  console.info('BottomTabsContainer render');

  const { tabConfigs, ...restProps } = props;

  const [focusedTabKey, setFocusedTabKey] = React.useState<string>(() => {
    console.log('BottomTabsContainer focusedStateKey initial state computed');

    if (props.tabConfigs.length === 0) {
      throw new Error('There must be at least one tab defined');
    }

    const maybeUserRequestedFocusedTab = tabConfigs.find(
      tabConfig => tabConfig.tabScreenProps.isFocused === true,
    )?.tabScreenProps.tabKey;

    if (maybeUserRequestedFocusedTab != null) {
      return maybeUserRequestedFocusedTab;
    }

    // Default to first tab
    return tabConfigs[0].tabScreenProps.tabKey;
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
      {...restProps}
      onNativeFocusChange={onNativeFocusChangeCallback}
      experimentalControlNavigationStateInJS={
        configWrapper.config.controlledBottomTabs
      }>
      {tabConfigs.map(tabConfig => {
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
