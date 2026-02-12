import React from 'react';
import { Platform, type NativeSyntheticEvent } from 'react-native';
import {
  Tabs,
  TabsHostProps,
  TabsScreenProps,
  NativeFocusChangeEvent,
} from 'react-native-screens';
import SafeAreaView from '../../../../../../src/components/safe-area/SafeAreaView';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';
import ConfigWrapperContext from './ConfigWrapperContext';

export interface TabConfiguration {
  tabScreenProps: TabsScreenProps;
  component: React.ComponentType;
  safeAreaConfiguration?: SafeAreaViewProps;
}

export type BottomTabsContainerProps = TabsHostProps & {
  tabConfigs: TabConfiguration[];
};

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
    <Tabs.Host
      // Use controlled bottom tabs by default, but allow to overwrite if user wants to
      onNativeFocusChange={onNativeFocusChangeCallback}
      experimentalControlNavigationStateInJS={
        configWrapper.config.controlledBottomTabs
      }
      {...restProps}>
      {tabConfigs.map(tabConfig => {
        const tabKey = tabConfig.tabScreenProps.tabKey;
        const isFocused = tabConfig.tabScreenProps.tabKey === focusedTabKey;
        console.info(
          `BottomTabsContainer map to component -> ${tabKey} ${
            isFocused ? '(focused)' : ''
          }`,
        );

        return (
          <Tabs.Screen
            key={tabKey}
            {...tabConfig.tabScreenProps}
            isFocused={isFocused} // notice that the value passed by user is overriden here!
          >
            {getContent(tabConfig)}
          </Tabs.Screen>
        );
      })}
    </Tabs.Host>
  );
}

function getContent(tabConfig: TabConfiguration) {
  const { safeAreaConfiguration, component: Component } = tabConfig;

  const safeAreaConfigurationWithDefault = getSafeAreaViewEdges(
    safeAreaConfiguration?.edges,
  );

  const anySAVEdgeSet = Object.values(safeAreaConfigurationWithDefault).some(
    edge => edge === true,
  );

  if (anySAVEdgeSet) {
    return (
      <SafeAreaView {...safeAreaConfiguration}>
        <Component />
      </SafeAreaView>
    );
  }

  return <Component />;
}

function getSafeAreaViewEdges(
  edges?: SafeAreaViewProps['edges'],
): NonNullable<SafeAreaViewProps['edges']> {
  let defaultEdges: SafeAreaViewProps['edges'];

  switch (Platform.OS) {
    case 'android':
      defaultEdges = { bottom: true };
      break;
    default:
      defaultEdges = {};
      break;
  }

  return { ...defaultEdges, ...edges };
}
