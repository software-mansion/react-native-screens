import {
  NavigationIndependentTree,
  ParamListBase,
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

type StackScreenConfig = RouteConfigProps<
  ParamListBase,
  any,
  any,
  any,
  any,
  any
> & { component: ComponentType };

type StackConfigAction = {
  type: 'screen';
  name: string;
  config: NativeStackNavigationOptions;
};

const ConfigContext = createContext<StackScreenConfig[]>([]);
const ConfigDispatchContext = createContext<Dispatch<StackConfigAction>>(
  () => {},
);

function reduce(config: StackScreenConfig[], action: StackConfigAction) {
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
): StackScreenConfig[] {
  return Object.entries(screens).map(([k, C]) => ({
    name: k,
    component: C,
    options: { title: k },
  }));
}

export function useStackConfig() {
  const config = useContext(ConfigContext);
  return config;
}

export function useDispatchStackConfig() {
  const dispatch = useContext(ConfigDispatchContext);
  return dispatch;
}

export function StackAutoconfig() {
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

export default function StackConfigProvider(props: {
  children: ReactNode | ReactNode[];
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
