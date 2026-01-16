import {
  BottomTabsContainer,
  TabConfiguration,
} from '../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import React, {
  ComponentType,
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import { TabsHostProps } from 'react-native-screens';
import { KeyList } from './helpers';

type StaticTabScreenProps<S extends KeyList> = Omit<
  TabConfiguration['tabScreenProps'],
  'tabKey'
> & { tabKey: Extract<keyof S, string> };

type StaticTabConfiguration<S extends KeyList> = Omit<
  TabConfiguration,
  'tabScreenProps'
> & {
  tabScreenProps: StaticTabScreenProps<S>;
};

type StaticTabsContainerProps<S extends KeyList> = TabsHostProps & {
  tabConfigs: StaticTabConfiguration<S>[];
};

type TabConfigUpdate<S extends KeyList> =
  | {
      type: 'tabScreen';
      tabKey: Extract<keyof S, string>;
      config: Partial<
        Omit<StaticTabConfiguration<S>, 'tabScreenProps'> & {
          tabScreenProps: Partial<StaticTabScreenProps<S>>;
        }
      >;
    }
  | {
      type: 'tabBar';
      config: Partial<Omit<StaticTabsContainerProps<S>, 'tabConfigs'>>;
    };

const ConfigContext = createContext<StaticTabsContainerProps<any>>({
  tabConfigs: [],
});

const ConfigDispatchContext = createContext<Dispatch<TabConfigUpdate<any>>>(
  () => {},
);

function reduce(
  config: StaticTabsContainerProps<any>,
  action: TabConfigUpdate<any>,
) {
  switch (action.type) {
    case 'tabBar':
      config = { ...config, ...action.config };
      break;
    case 'tabScreen':
      const tabIndex = config.tabConfigs.findIndex(
        c => c.tabScreenProps.tabKey === action.tabKey,
      );
      if (tabIndex >= 0) {
        config.tabConfigs[tabIndex] = {
          ...config.tabConfigs[tabIndex],
          ...action.config,
          tabScreenProps: {
            ...config.tabConfigs[tabIndex].tabScreenProps,
            ...action.config.tabScreenProps,
          },
        };
        config = { ...config };
      }
      break;
  }

  return config;
}

function makeInitialConfig(
  tabs: Record<string, ComponentType>,
): StaticTabsContainerProps<any> {
  return {
    tabConfigs: Object.entries(tabs).map(([k, C]) => ({
      tabScreenProps: {
        tabKey: k,
        title: k,
        icon: {
          shared: {
            type: 'imageSource',
            imageSource: require('../../../assets/variableIcons/icon.png'),
          },
        },
      },
      component: C,
    })),
  };
}

/**
 * Configuration for the Tabs.
 * Use within the Provider returned by createTabsConfig.
 * Template parameter with available Tab keys is required.
 */
export function useTabsConfig<
  S extends KeyList = {},
>(): StaticTabsContainerProps<S> {
  const config = useContext(ConfigContext);
  return config as StaticTabsContainerProps<S>;
}

/**
 * Dispatcher for useReducer pattern for Tabs configuration.
 * Use within the Provider returned by createTabsConfig.
 * Template parameter with available Tab keys is required.
 */
export function useDispatchTabsConfig<S extends KeyList = {}>(): Dispatch<
  TabConfigUpdate<S>
> {
  const dispatch = useContext(ConfigDispatchContext);
  return dispatch;
}

function TabsAutoconfig() {
  const config = useTabsConfig();

  return <BottomTabsContainer {...config} />;
}

function TabsConfigProvider(props: {
  children: ReactNode | ReactNode[];
  tabs: Record<string, ComponentType>;
}) {
  const [config, dispatch] = useReducer(reduce, makeInitialConfig(props.tabs));

  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {props.children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

/**
 * Creates a Provider and Autoconfig component for easy Tabs configuration.
 * Template parameter with available Tab keys is required.
 */
export function createTabsConfig<S extends KeyList = {}>(
  tabs: {} extends S
    ? never
    : Record<Extract<keyof S, string>, React.ComponentType>,
) {
  return {
    Provider: (props: { children: ReactNode | ReactNode[] }) => (
      <TabsConfigProvider tabs={tabs}>{props.children}</TabsConfigProvider>
    ),
    Autoconfig: TabsAutoconfig,
  };
}

export function findTabScreenOptions<S extends KeyList>(
  config: StaticTabsContainerProps<S>,
  key: Extract<keyof S, string>,
): StaticTabConfiguration<S> | undefined {
  return config.tabConfigs.find(c => c.tabScreenProps.tabKey === key);
}
