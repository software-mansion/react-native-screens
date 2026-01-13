import type {
  NavigationAction,
  NavigationActionNativePop,
  NavigationActionPop,
  NavigationActionPopCompleted,
  NavigationActionPreload,
  NavigationActionPush,
  StackRoute,
  StackRouteConfig,
  StackState,
} from './StackContainer.types';
import { generateID } from './utils/id-generator';

const NOT_FOUND_INDEX = -1;

export function navigationStateReducer(
  state: StackState,
  action: NavigationAction,
): StackState {
  switch (action.type) {
    case 'push': {
      return navigationActionPushHandler(state, action);
    }
    case 'pop': {
      return navigationActionPopHandler(state, action);
    }
    case 'pop-completed': {
      return navigationActionPopCompletedHandler(state, action);
    }
    case 'pop-native': {
      return navigationActionNativePopHandler(state, action);
    }
    case 'preload': {
      return navigationActionPreloadHandler(state, action);
    }
  }

  // @ts-ignore
  throw new Error(
    `[Stack] Unhandled navigation action: ${JSON.stringify(action)}`,
  );
}

export function navigationStateReducerWithLogging(
  state: StackState,
  action: NavigationAction,
): StackState {
  console.debug(`[Stack] Handling action: ${JSON.stringify(action)}`);
  console.debug(`[Stack] BEFORE state: ${JSON.stringify(state, undefined, 2)}`);
  const newState = navigationStateReducer(state, action);
  if (state === newState) {
    console.debug('[Stack] AFTER state: unchanged');
  } else {
    console.debug(
      `[Stack] AFTER state: ${JSON.stringify(newState, undefined, 2)}`,
    );
  }
  return newState;
}

function navigationActionPushHandler(
  state: StackState,
  action: NavigationActionPush,
): StackState {
  // 1 - Check whether the route is already rendered
  const renderedRouteIndex = state.findIndex(
    route =>
      route.name === action.routeName && route.activityMode === 'detached',
  );

  if (renderedRouteIndex !== NOT_FOUND_INDEX) {
    const route = state[renderedRouteIndex];

    console.info(`[Stack] Route ${route.name} already rendered, attaching it`);
    const newState = state.toSpliced(renderedRouteIndex, 1);
    const routeCopy = { ...route };
    routeCopy.activityMode = 'attached';
    // Please note that we are pushing the route copy to the end of the array,
    // to mitigate potential issues with element inspector and state restoration.
    newState.push(routeCopy);
    return newState;
  }

  // 2 - Try to render new route
  const newRouteConfig = action.ctx.routeConfigs.find(
    route => route.name === action.routeName,
  );
  if (newRouteConfig == null) {
    throw new Error(
      `[Stack] Unable to find route with name: ${action.routeName}`,
    );
  }

  const newRoute = createRouteFromConfig(newRouteConfig);
  newRoute.activityMode = 'attached';

  return [...state, newRoute];
}

function navigationActionPopHandler(
  state: StackState,
  action: NavigationActionPop,
): StackState {
  // FIXME: We have a problem here. We can not really determine, which route is currently at the very top!
  // For now let's just accept routeKey as param here.

  const attachedCount = state.reduce((count, route) => {
    if (route.activityMode === 'attached') {
      return count + 1;
    } else {
      return count;
    }
  }, 0);

  if (attachedCount <= 1) {
    console.warn(
      `[Stack] Can not perform pop action on route: ${action.routeKey} - at least one route must be present`,
    );
    return state;
  }

  const routeIndex = state.findIndex(
    route => route.routeKey === action.routeKey,
  );
  if (routeIndex === NOT_FOUND_INDEX) {
    console.warn(
      `[Stack] Can not perform pop action on route: ${action.routeKey} - no such route in state!`,
    );
    return state;
  }

  const route = state[routeIndex];

  if (route.activityMode === 'detached') {
    console.warn(
      `[Stack] Can not perform pop action on route: ${action.routeKey} - already in detached mode!`,
    );
    return state;
  }

  const newState = [...state];
  // NOTE: This modifes existing state, possibly impacting calculations done before new state is updated.
  // Consider doing deep copy of the state here.
  // EDIT: not sure really whether this is really a problem or not, since the updates are queued
  // and the original state won't be immediatelly affected.
  route.activityMode = 'detached';

  return newState;
}

function navigationActionPopCompletedHandler(
  state: StackState,
  action: NavigationActionPopCompleted,
): StackState {
  const routeIndex = state.findIndex(
    route => route.routeKey === action.routeKey,
  );
  if (routeIndex === NOT_FOUND_INDEX) {
    console.error(
      `[Stack] Can not perform 'pop-completed' action - popped screen is no longer in state!`,
    );
    return state;
  }

  const route = state[routeIndex];
  if (route.activityMode !== 'detached') {
    console.warn(`[Stack] Popped non-detached route!`);
  }

  console.debug(`Remove route: ${action.routeKey} from index: ${routeIndex}`);

  // Let's remove the route from the state
  // TODO: Consider adding option for keeping it in state.
  const newState = state.toSpliced(routeIndex, 1);
  return newState;
}

function navigationActionNativePopHandler(
  state: StackState,
  action: NavigationActionNativePop,
): StackState {
  if (state.length <= 1) {
    throw new Error(
      '[Stack] action: "pop-native" can not be performed with less than 2 routes!',
    );
  }

  const routeIndex = state.findIndex(
    route => route.routeKey === action.routeKey,
  );
  if (routeIndex === NOT_FOUND_INDEX) {
    console.error(
      `[Stack] Can not perform 'pop-native' action - popped screen is not in state!`,
    );
    return state;
  }

  const route = state[routeIndex];
  if (route.activityMode === 'detached') {
    console.warn('[Stack] natively popped route has "detached" state');
  }

  const newState = state.toSpliced(routeIndex, 1);
  return newState;
}

function navigationActionPreloadHandler(
  state: StackState,
  action: NavigationActionPreload,
): StackState {
  const routeConfig = action.ctx.routeConfigs.find(
    config => config.name === action.routeName,
  );

  if (!routeConfig) {
    console.error(
      `[Stack] Can not perform 'preload' action - route config with name: ${action.routeName} not found!`,
    );
    return state;
  }

  return [...state, createRouteFromConfig(routeConfig)];
}

export function createRouteFromConfig(config: StackRouteConfig): StackRoute {
  return {
    ...config,
    activityMode: 'detached',
    routeKey: generateRouteKeyForRouteName(config.name),
  };
}

function generateRouteKeyForRouteName(routeName: string): string {
  return `r-${routeName}-${generateID()}`;
}
