import {
  BottomTabsContainer,
  BottomTabsContainerProps,
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
import { BottomTabsProps } from 'react-native-screens';
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

type StaticBottomTabsContainerProps<S extends KeyList> = BottomTabsProps & {
  tabConfigs: StaticTabConfiguration<S>[];
};

type BottomTabConfigUpdate<S extends KeyList> =
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
      config: Partial<Omit<StaticBottomTabsContainerProps<S>, 'tabConfigs'>>;
    };

const ConfigContext = createContext<StaticBottomTabsContainerProps<any>>({
  tabConfigs: [],
});

const ConfigDispatchContext = createContext<
  Dispatch<BottomTabConfigUpdate<any>>
>(() => {});

function reduce(
  config: StaticBottomTabsContainerProps<any>,
  action: BottomTabConfigUpdate<any>,
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
): BottomTabsContainerProps {
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
export function useBottomTabsConfig<
  S extends KeyList = {},
>(): StaticBottomTabsContainerProps<S> {
  const config = useContext(ConfigContext);
  return config as StaticBottomTabsContainerProps<S>;
}

/**
 * Dispatcher for useReducer pattern for Tabs configuration.
 * Use within the Provider returned by createTabsConfig.
 * Template parameter with available Tab keys is required.
 */
export function useDispatchBottomTabsConfig<S extends KeyList = {}>(): Dispatch<
  BottomTabConfigUpdate<S>
> {
  const dispatch = useContext(ConfigDispatchContext);
  return dispatch;
}

function BottomTabsAutoconfig() {
  const config = useBottomTabsConfig();

  return <BottomTabsContainer {...config} />;
}

function BottomTabsConfigProvider(props: {
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
      <BottomTabsConfigProvider tabs={tabs}>
        {props.children}
      </BottomTabsConfigProvider>
    ),
    Autoconfig: BottomTabsAutoconfig,
  };
}

export function findTabScreenOptions<S extends KeyList>(
  config: StaticBottomTabsContainerProps<S>,
  key: Extract<keyof S, string>,
): StaticTabConfiguration<S> | undefined {
  return config.tabConfigs.find(c => c.tabScreenProps.tabKey === key);
}
