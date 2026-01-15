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

type BottomTabConfigAction =
  | {
      type: 'tabScreen';
      tabKey: string;
      config: Partial<
        Omit<TabConfiguration, 'tabScreenProps'> & {
          tabScreenProps: Partial<TabConfiguration['tabScreenProps']>;
        }
      >;
    }
  | {
      type: 'tabBar';
      config: Omit<Partial<BottomTabsContainerProps>, 'tabConfigs'>;
    };

const ConfigContext = createContext<BottomTabsContainerProps>({
  tabConfigs: [],
});
const ConfigDispatchContext = createContext<Dispatch<BottomTabConfigAction>>(
  () => {},
);

function reduce(
  config: BottomTabsContainerProps,
  action: BottomTabConfigAction,
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

export function useBottomTabsConfig() {
  const config = useContext(ConfigContext);
  return config;
}

export function useDispatchBottomTabsConfig() {
  const dispatch = useContext(ConfigDispatchContext);
  return dispatch;
}

export function BottomTabsAutoconfig() {
  const config = useBottomTabsConfig();

  return <BottomTabsContainer {...config} />;
}

export default function BottomTabsConfigProvider(props: {
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
