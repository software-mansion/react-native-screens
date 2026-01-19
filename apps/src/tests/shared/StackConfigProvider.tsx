import {
  NavigationIndependentTree,
  RouteConfigProps,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React, {
  ComponentType,
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import { KeyList } from './helpers';
import { ViewProps } from 'react-native';

type StackScreenConfig<S extends KeyList> = RouteConfigProps<
  S,
  keyof S,
  any,
  any,
  any,
  any
> & { component: ComponentType };

type StackConfigUpdate<S extends KeyList> = {
  type: 'screen';
  name: Extract<keyof S, string>;
  config: NativeStackNavigationOptions;
};

const ConfigContext = createContext<StackScreenConfig<any>[]>([]);
const ConfigDispatchContext = createContext<Dispatch<StackConfigUpdate<any>>>(
  () => {},
);

function reduce(
  config: StackScreenConfig<any>[],
  action: StackConfigUpdate<any>,
) {
  switch (action.type) {
    case 'screen':
      const index = config.findIndex(c => c.name === action.name);
      if (index >= 0) {
        config[index] = {
          ...config[index],
          options: {
            ...config[index].options,
            ...action.config,
          },
        };
        config = [...config];
      }
      break;
  }

  return config;
}

function makeInitialConfig(
  screens: Record<string, ComponentType>,
): StackScreenConfig<any>[] {
  return Object.entries(screens).map(([k, C]) => ({
    name: k,
    component: C,
    options: { title: k },
  }));
}

/**
 * Configuration for the Stack.
 * Use within the Provider returned by createStackConfig.
 * Template parameter with available Screen names is required.
 */
export function useStackConfig<
  S extends KeyList = {},
>(): StackScreenConfig<S>[] {
  const config = useContext(ConfigContext);
  return config as StackScreenConfig<S>[];
}

/**
 * Dispatcher for useReducer pattern for Stack configuration.
 * Use within the Provider returned by createStackConfig.
 * Template parameter with available Screen names is required.
 */
export function useDispatchStackConfig<S extends KeyList = {}>(): Dispatch<
  StackConfigUpdate<S>
> {
  const dispatch = useContext(ConfigDispatchContext);
  return dispatch;
}

function StackAutoconfig() {
  const config = useStackConfig();
  const Stack = createNativeStackNavigator();

  return (
    <NavigationIndependentTree>
      <Stack.Navigator>
        {config.map(c => (
          <Stack.Screen
            key={c.name}
            name={c.name}
            options={c.options}
            component={c.component as any}
          />
        ))}
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
}

function StackConfigProvider(props: {
  children: ViewProps['children'];
  screens: Record<string, ComponentType>;
}) {
  const [config, dispatch] = useReducer(
    reduce,
    makeInitialConfig(props.screens),
  );

  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {props.children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

/**
 * Creates a Provider and Autoconfig component for easy Stack configuration.
 * Template parameter with available Screen names is required.
 */
export function createStackConfig<S extends KeyList = {}>(
  screens: {} extends S
    ? never
    : Record<Extract<keyof S, string>, React.ComponentType>,
) {
  return {
    Provider: (props: { children: ReactNode | ReactNode[] }) => (
      <StackConfigProvider screens={screens}>
        {props.children}
      </StackConfigProvider>
    ),
    Autoconfig: StackAutoconfig,
  };
}

export function findStackScreenOptions<S extends KeyList>(
  config: StackScreenConfig<S>[],
  key: Extract<keyof S, string>,
): StackScreenConfig<S>['options'] | undefined {
  return config.find(c => c.name === key)?.options;
}
