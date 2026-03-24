import { generateID } from '../shared/id-generator';
import type {
  TabRoute,
  TabRouteConfig,
  TabsNavState,
  TabsNavigationAction,
  TabsNavigationActionChangeTab,
  TabsNavigationActionSetOptions,
} from './TabsContainer.types';

const NOT_FOUND_INDEX = -1;

export function tabsNavigationReducer(
  state: TabsNavState,
  action: TabsNavigationAction,
): TabsNavState {
  switch (action.type) {
    case 'change-tab':
      return tabsActionChangeTabHandler(state, action);
    case 'set-options':
      return tabsActionSetOptionsHandler(state, action);
  }

  // @ts-ignore
  throw new Error(
    `[Tabs] Unhandled navigation action: ${JSON.stringify(action)}`,
  );
}

export function tabsNavigationReducerWithLogging(
  state: TabsNavState,
  action: TabsNavigationAction,
): TabsNavState {
  console.debug(`[Tabs] Handling action: ${JSON.stringify(action)}`);
  console.debug(`[Tabs] BEFORE state: ${JSON.stringify(state, undefined, 2)}`);
  const newState = tabsNavigationReducer(state, action);
  if (state === newState) {
    console.debug('[Tabs] AFTER state: unchanged');
  } else {
    console.debug(
      `[Tabs] AFTER state: ${JSON.stringify(newState, undefined, 2)}`,
    );
  }
  return newState;
}

function tabsActionChangeTabHandler(
  state: TabsNavState,
  action: TabsNavigationActionChangeTab,
): TabsNavState {
  const routeIndex = state.routes.findIndex(
    r => r.routeKey === action.routeKey,
  );

  if (routeIndex === NOT_FOUND_INDEX) {
    console.warn(
      `[Tabs] change-tab: route with key "${action.routeKey}" not found in state. Ignoring.`,
    );
    return state;
  }

  if (state.selectedRouteKey === action.routeKey) {
    return state;
  }

  return {
    ...state,
    selectedRouteKey: action.routeKey,
  };
}

function tabsActionSetOptionsHandler(
  state: TabsNavState,
  action: TabsNavigationActionSetOptions,
): TabsNavState {
  const routeIndex = state.routes.findIndex(
    r => r.routeKey === action.routeKey,
  );

  if (routeIndex === NOT_FOUND_INDEX) {
    throw new Error(
      `[Tabs] Cannot set options. Route with key "${action.routeKey}" not found`,
    );
  }

  const routeCopy = { ...state.routes[routeIndex] };
  routeCopy.options = {
    ...routeCopy.options,
    ...action.options,
  };

  return {
    ...state,
    routes: state.routes.toSpliced(routeIndex, 1, routeCopy),
  };
}

function createTabRouteFromConfig(config: TabRouteConfig): TabRoute {
  return {
    ...config,
    routeKey: `r-${config.name}-${generateID()}`,
  };
}

export type TabsNavStateInitArg = {
  routeConfigs: TabRouteConfig[];
  initialFocusedName?: string;
};

export function determineInitialTabsNavState(
  arg: TabsNavStateInitArg,
): TabsNavState {
  const { routeConfigs, initialFocusedName } = arg;

  const routes = routeConfigs.map(createTabRouteFromConfig);

  let selectedRouteKey: string;
  if (initialFocusedName != null) {
    const matchingRoute = routes.find(r => r.name === initialFocusedName);
    if (matchingRoute == null) {
      throw new Error(
        `[Tabs] initialFocusedName "${initialFocusedName}" does not match any route config name`,
      );
    }
    selectedRouteKey = matchingRoute.routeKey;
  } else {
    selectedRouteKey = routes[0].routeKey;
  }

  return { routes, selectedRouteKey };
}
