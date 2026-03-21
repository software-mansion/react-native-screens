import { Platform } from 'react-native';
import type {
  TabRoute,
  TabRouteConfig,
  TabsContainerState,
  TabsNavState,
  TabsNavigationAction,
  TabsNavigationActionChangeTab,
  TabsNavigationActionNativeChangeTab,
  TabsNavigationActionSetOptions,
} from './TabsContainer.types';

const NOT_FOUND_INDEX = -1;

export function tabsNavigationReducer(
  state: TabsContainerState,
  action: TabsNavigationAction,
): TabsContainerState {
  switch (action.type) {
    case 'tab-change':
      return tabsActionChangeTabHandler(state, action);
    case 'native-tab-change':
      return tabsActionNativeChangeTabHandler(state, action);
    case 'set-options':
      return tabsActionSetOptionsHandler(state, action);
  }

  // @ts-ignore
  throw new Error(
    `[Tabs] Unhandled navigation action: ${JSON.stringify(action)}`,
  );
}

export function tabsNavigationReducerWithLogging(
  state: TabsContainerState,
  action: TabsNavigationAction,
): TabsContainerState {
  console.log(`[Tabs] Handling action: ${JSON.stringify(action)}`);
  console.log(`[Tabs] BEFORE state: ${JSON.stringify(state, undefined, 2)}`);
  const newState = tabsNavigationReducer(state, action);
  if (state === newState) {
    console.log('[Tabs] AFTER state: unchanged');
  } else {
    console.log(
      `[Tabs] AFTER state: ${JSON.stringify(newState, undefined, 2)}`,
    );
  }
  return newState;
}

/**
 * Models JS-driven tab change request.
 */
function tabsActionChangeTabHandler(
  state: TabsContainerState,
  action: TabsNavigationActionChangeTab,
): TabsContainerState {
  const routeIndex = state.routes.findIndex(
    r => r.routeKey === action.routeKey,
  );

  if (routeIndex === NOT_FOUND_INDEX && !doesRouteKeyPointToMoreNavigationController(action.routeKey)) {
    console.error(
      `[Tabs] change-tab: route with key "${action.routeKey}" not found in state. Ignoring.`,
    );
    return state;
  }

  if (state.confirmedState.selectedRouteKey === action.routeKey) {
    return state;
  }

  return navStateWithSuggestedState(state, {
    selectedRouteKey: action.routeKey,
    provenance: state.confirmedState.provenance + 1, // suggested? What about update stacking before we receive confirmation?
  });
}

function tabsActionNativeChangeTabHandler(
  state: TabsContainerState,
  action: TabsNavigationActionNativeChangeTab,
): TabsContainerState {
  const routeIndex = state.routes.findIndex(
    r => r.routeKey === action.routeKey,
  );

  if (routeIndex === NOT_FOUND_INDEX && !doesRouteKeyPointToMoreNavigationController(action.routeKey)) {
    console.error(
      `[Tabs] change-tab: route with key "${action.routeKey}" not found in state. Ignoring.`,
    );
    return state;
  }

  if (
    state.confirmedState.selectedRouteKey === action.routeKey &&
    state.confirmedState.provenance === action.nativeEvent.provenance
  ) {
    console.warn(
      `[Tabs] Duplicated state confirmation event! ${JSON.stringify(
        action.nativeEvent,
      )}`,
    );
    return state;
  }

  // What about aligning suggestedState here?
  return navStateWithConfirmedState(state, {
    selectedRouteKey: action.routeKey,
    provenance: action.nativeEvent.provenance,
  });
}

function tabsActionSetOptionsHandler(
  state: TabsContainerState,
  action: TabsNavigationActionSetOptions,
): TabsContainerState {
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
    // Tab names are required to be unique (enforced by useSanitizeRouteConfigs),
    // so the name itself serves as a stable unique key.
    routeKey: config.name,
  };
}

export type TabsContainerStateInitArg = {
  routeConfigs: TabRouteConfig[];
  initialFocusedName?: string;
};

export function determineInitialTabsContainerState(
  arg: TabsContainerStateInitArg,
): TabsContainerState {
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

  // suggestedState & confirmedState are aligned here. We assume that JS
  // decides what is rendered after first render, therefore we don't need
  // to wait for confirmation. This simplifies implementation of the reducer.
  return {
    routes,
    suggestedState: {
      selectedRouteKey: selectedRouteKey,
      provenance: 0,
    },
    confirmedState: {
      selectedRouteKey: selectedRouteKey,
      provenance: 0,
    },
  };
}

function navStateWithSuggestedState(
  state: TabsContainerState,
  suggestedState: TabsNavState,
): TabsContainerState {
  return {
    routes: state.routes,
    confirmedState: state.confirmedState,
    suggestedState: suggestedState,
  };
}

function navStateWithConfirmedState(
  state: TabsContainerState,
  confirmedState: TabsNavState,
): TabsContainerState {
  return {
    routes: state.routes,
    confirmedState: confirmedState,
    suggestedState: state.suggestedState,
  };
}

function doesRouteKeyPointToMoreNavigationController(routeKey: string): boolean {
  return Platform.OS === 'ios' && routeKey === 'moreNavigationController';
}
