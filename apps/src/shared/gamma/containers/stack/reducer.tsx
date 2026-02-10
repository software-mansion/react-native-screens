import type { StackScreenActivityMode } from 'react-native-screens/experimental';
import type {
  NavigationAction,
  NavigationActionBatch,
  NavigationActionClearEffects,
  NavigationActionNativePop,
  NavigationActionPop,
  NavigationActionPopCompleted,
  NavigationActionPreload,
  NavigationActionPush,
  StackNavigationEffect,
  StackNavigationState,
  StackRoute,
  StackRouteConfig,
  StackState,
} from './StackContainer.types';
import { generateID } from './utils/id-generator';

const NOT_FOUND_INDEX = -1;

export function navigationStateReducer(
  state: StackNavigationState,
  action: NavigationAction,
): StackNavigationState {
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
    case 'batch': {
      return navigationActionBatchHandler(state, action);
    }
    case 'clear-effects': {
      return navigationActionClearEffectsHandler(state, action);
    }
  }

  // @ts-ignore
  throw new Error(
    `[Stack] Unhandled navigation action: ${JSON.stringify(action)}`,
  );
}

export function navigationStateReducerWithLogging(
  state: StackNavigationState,
  action: NavigationAction,
): StackNavigationState {
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
  state: StackNavigationState,
  action: NavigationActionPush,
): StackNavigationState {
  // 1 - Check whether the route is already rendered
  const stack = state.stack;
  const renderedRouteIndex = stack.findIndex(
    route =>
      route.name === action.routeName && route.activityMode === 'detached',
  );

  if (renderedRouteIndex !== NOT_FOUND_INDEX) {
    const route = stack[renderedRouteIndex];

    console.info(`[Stack] Route ${route.name} already rendered, attaching it`);
    const newStack = stack.toSpliced(renderedRouteIndex, 1);
    const routeCopy = { ...route };
    routeCopy.activityMode = 'attached';
    return stackNavStateWithStack(state, applyPush(newStack, routeCopy));
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

  const newRoute = createRouteFromConfig(newRouteConfig, 'attached');
  return stackNavStateWithStack(state, applyPush(state.stack, newRoute));
}

function navigationActionPopHandler(
  state: StackNavigationState,
  action: NavigationActionPop,
): StackNavigationState {
  // FIXME: We have a problem here. We can not really determine, which route is currently at the very top!
  // For now let's just accept routeKey as param here.

  const stack = state.stack;

  const attachedCount = stack.reduce((count, route) => {
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
    if (
      state.effects.findIndex(effect => effect.type === 'pop-container') !==
      NOT_FOUND_INDEX
    ) {
      // If there is already a pop-container effect, do nothing
      return state;
    }
    return stackNavStateWithEffects(
      state,
      applyEffect(state.effects, { type: 'pop-container' }),
    );
  }

  const routeIndex = stack.findIndex(
    route => route.routeKey === action.routeKey,
  );
  if (routeIndex === NOT_FOUND_INDEX) {
    console.warn(
      `[Stack] Can not perform pop action on route: ${action.routeKey} - no such route in state!`,
    );
    return state;
  }

  const route = stack[routeIndex];

  if (route.activityMode === 'detached') {
    console.warn(
      `[Stack] Can not perform pop action on route: ${action.routeKey} - already in detached mode!`,
    );
    return state;
  }

  const newStack = [...stack];
  // NOTE: This modifies existing state, possibly impacting calculations done before new state is updated.
  // Consider doing deep copy of the state here.
  // EDIT: not sure really whether this is really a problem or not, since the updates are queued
  // and the original state won't be immediatelly affected.
  route.activityMode = 'detached';

  return stackNavStateWithStack(state, newStack);
}

function navigationActionPopCompletedHandler(
  state: StackNavigationState,
  action: NavigationActionPopCompleted,
): StackNavigationState {
  const stack = state.stack;
  const routeIndex = stack.findIndex(
    route => route.routeKey === action.routeKey,
  );
  if (routeIndex === NOT_FOUND_INDEX) {
    console.error(
      `[Stack] Can not perform 'pop-completed' action - popped screen is no longer in state!`,
    );
    return state;
  }

  const route = stack[routeIndex];
  if (route.activityMode !== 'detached') {
    console.warn(`[Stack] Popped non-detached route!`);
  }

  console.debug(`Remove route: ${action.routeKey} from index: ${routeIndex}`);

  // Let's remove the route from the state
  // TODO: Consider adding option for keeping it in state.
  const newStack = stack.toSpliced(routeIndex, 1);
  return stackNavStateWithStack(state, newStack);
}

function navigationActionNativePopHandler(
  state: StackNavigationState,
  action: NavigationActionNativePop,
): StackNavigationState {
  const stack = state.stack;
  if (stack.length <= 1) {
    throw new Error(
      '[Stack] action: "pop-native" can not be performed with less than 2 routes!',
    );
  }

  const routeIndex = stack.findIndex(
    route => route.routeKey === action.routeKey,
  );
  if (routeIndex === NOT_FOUND_INDEX) {
    console.error(
      `[Stack] Can not perform 'pop-native' action - popped screen is not in state!`,
    );
    return state;
  }

  const route = stack[routeIndex];
  if (route.activityMode === 'detached') {
    console.warn('[Stack] natively popped route has "detached" state');
  }

  const newStack = stack.toSpliced(routeIndex, 1);
  return stackNavStateWithStack(state, newStack);
}

function navigationActionPreloadHandler(
  state: StackNavigationState,
  action: NavigationActionPreload,
): StackNavigationState {
  const routeConfig = action.ctx.routeConfigs.find(
    config => config.name === action.routeName,
  );

  if (!routeConfig) {
    console.error(
      `[Stack] Can not perform 'preload' action - route config with name: ${action.routeName} not found!`,
    );
    return state;
  }

  // Preloaded routes are kept at the end of the list to allow order manipulations
  // that won't result in problems on native platform.
  // More info: https://github.com/software-mansion/react-native-screens/pull/3531.
  const newStack = [...state.stack, createRouteFromConfig(routeConfig)];
  return stackNavStateWithStack(state, newStack);
}

function navigationActionBatchHandler(
  state: StackNavigationState,
  action: NavigationActionBatch,
): StackNavigationState {
  return action.actions.reduce(navigationStateReducer, state);
}

function createRouteFromConfig(
  config: StackRouteConfig,
  activityMode: StackScreenActivityMode = 'detached',
): StackRoute {
  return {
    ...config,
    activityMode,
    routeKey: generateRouteKeyForRouteName(config.name),
  };
}

function navigationActionClearEffectsHandler(
  state: StackNavigationState,
  _action: NavigationActionClearEffects,
): StackNavigationState {
  if (state.effects.length === 0) {
    return state;
  }
  return stackNavStateWithEffects(state, []);
}

// Ensures correct order of screens (attached first, detached at the end).
// This will help with state restoration but WILL NOT help with inspector.
function applyPush(state: StackState, newRoute: StackRoute): StackState {
  const lastAttachedIndex = state.findLastIndex(
    route => route.activityMode === 'attached',
  );

  if (lastAttachedIndex === -1) {
    throw new Error(
      `[Stack] Invalid stack state: there should be at least one attached route on the stack.`,
    );
  }

  return state.toSpliced(lastAttachedIndex + 1, 0, newRoute);
}

function applyEffect(
  effects: StackNavigationEffect[],
  newEffect: StackNavigationEffect,
): StackNavigationEffect[] {
  return effects.concat(newEffect);
}

export function determineInitialNavigationState(
  routeConfigs: StackRouteConfig[],
): StackNavigationState {
  const firstRoute = createRouteFromConfig(routeConfigs[0], 'attached');
  return {
    stack: [firstRoute],
    effects: [],
  };
}

function generateRouteKeyForRouteName(routeName: string): string {
  return `r-${routeName}-${generateID()}`;
}

function stackNavStateWithStack(
  navState: StackNavigationState,
  newStack: StackState,
): StackNavigationState {
  return {
    ...navState,
    stack: newStack,
  };
}

function stackNavStateWithEffects(
  navState: StackNavigationState,
  newEffects: StackNavigationEffect[],
): StackNavigationState {
  return {
    ...navState,
    effects: newEffects,
  };
}
