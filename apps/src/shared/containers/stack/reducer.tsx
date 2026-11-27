import { Provenance } from 'react-native-screens';
import type {
  BatchedNavigationAction,
  NavigationAction,
  NavigationActionClearEffects,
  NavigationActionNavStateChanged,
  NavigationActionNavStateRequestRejected,
  NavigationActionPop,
  NavigationActionPreload,
  NavigationActionPush,
  NavigationActionScreensReleased,
  NavigationActionSetRouteOptions,
  StackConfirmedState,
  StackIntentStep,
  StackNavigationEffect,
  StackNavigationState,
  StackRoute,
  StackRouteConfig,
} from './StackContainer.types';
import { generateID } from '../shared/id-generator';
import { safeStringify } from '../shared/safe-stringify';

const NOT_FOUND_INDEX = -1;

const INITIAL_REQUEST_ID = 0;

export function navigationStateReducer(
  state: StackNavigationState,
  action: NavigationAction,
): StackNavigationState {
  switch (action.type) {
    case 'push':
    case 'pop':
    case 'preload':
    case 'set-options': {
      return navigationActionsHandler(state, [action]);
    }
    case 'batch': {
      return navigationActionsHandler(state, action.actions);
    }
    case 'clear-effects': {
      return navigationActionClearEffectsHandler(state, action);
    }
    case 'nav-state-changed': {
      return navStateChangedHandler(state, action);
    }
    case 'nav-state-request-rejected': {
      return navStateRequestRejectedHandler(state, action);
    }
    case 'screens-released': {
      return screensReleasedHandler(state, action);
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
  console.debug(`[Stack] Handling action: ${safeStringify(action)}`);
  console.debug(`[Stack] BEFORE state: ${safeStringify(state, 2)}`);
  const newState = navigationStateReducer(state, action);
  if (state === newState) {
    console.debug('[Stack] AFTER state: unchanged');
  } else {
    console.debug(`[Stack] AFTER state: ${safeStringify(newState, 2)}`);
  }
  return newState;
}

// #region JS actions

/**
 * Applies JS actions and, if they changed the desired stack, makes one new
 * request for the result. A batch is therefore a single request, so the host
 * runs a single transition for it.
 */
function navigationActionsHandler(
  state: StackNavigationState,
  actions: readonly BatchedNavigationAction[],
): StackNavigationState {
  const desiredStackBefore = getDesiredStack(state);
  const newState = actions.reduce(applyJsAction, state);

  if (newState === state) {
    return state;
  }

  const desiredStackAfter = getDesiredStack(newState);
  if (areStacksEqual(desiredStackBefore, desiredStackAfter)) {
    // E.g. a batch that pushes and pops the same route. With no request on
    // its way, the intent has nothing left to wait for.
    return newState.isRequestInFlight
      ? newState
      : stateWithSettledRequest(newState);
  }

  return stateWithNewRequest(newState, desiredStackAfter);
}

function applyJsAction(
  state: StackNavigationState,
  action: BatchedNavigationAction,
): StackNavigationState {
  switch (action.type) {
    case 'push':
      return navigationActionPushHandler(state, action);
    case 'pop':
      return navigationActionPopHandler(state, action);
    case 'preload':
      return navigationActionPreloadHandler(state, action);
    case 'set-options':
      return navigationActionSetOptionsHandler(state, action);
  }
}

function navigationActionPushHandler(
  state: StackNavigationState,
  action: NavigationActionPush,
): StackNavigationState {
  // 1 - Reuse a preloaded route, if there is one.
  const preloadedRouteIndex = state.routes.findIndex(
    route => route.name === action.routeName && route.isPreloaded,
  );

  if (preloadedRouteIndex !== NOT_FOUND_INDEX) {
    const route = state.routes[preloadedRouteIndex];
    console.info(`[Stack] Route ${route.name} already rendered, pushing it`);
    return {
      ...state,
      routes: state.routes.toSpliced(preloadedRouteIndex, 1, {
        ...route,
        isPreloaded: false,
      }),
      intent: [...state.intent, { type: 'push', routeKey: route.routeKey }],
    };
  }

  // 2 - Render a new route in the same commit as the request.
  const routeConfig = findRouteConfig(
    action.ctx.routeConfigs,
    action.routeName,
  );
  if (routeConfig == null) {
    throw new Error(
      `[Stack] Unable to find route with name: ${action.routeName}`,
    );
  }

  const newRoute = createRouteFromConfig(routeConfig, false);
  return {
    ...state,
    routes: [...state.routes, newRoute],
    intent: [...state.intent, { type: 'push', routeKey: newRoute.routeKey }],
  };
}

function navigationActionPopHandler(
  state: StackNavigationState,
  action: NavigationActionPop,
): StackNavigationState {
  const desiredStack = getDesiredStack(state);

  if (!desiredStack.includes(action.routeKey)) {
    console.warn(
      `[Stack] Can not perform pop action on route: ${action.routeKey} - it is not in the stack!`,
    );
    return state;
  }

  // An empty stack can not be requested, so popping the last route is
  // delegated to the parent container.
  if (desiredStack.length <= 1) {
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
    return stateWithEffects(
      state,
      applyEffect(state.effects, { type: 'pop-container' }),
    );
  }

  // Popping the top is a regular pop, popping a route below it removes it
  // from the middle of the stack without a transition.
  return {
    ...state,
    intent: [...state.intent, { type: 'pop', routeKey: action.routeKey }],
  };
}

function navigationActionPreloadHandler(
  state: StackNavigationState,
  action: NavigationActionPreload,
): StackNavigationState {
  const routeConfig = findRouteConfig(
    action.ctx.routeConfigs,
    action.routeName,
  );

  if (!routeConfig) {
    console.error(
      `[Stack] Can not perform 'preload' action - route config with name: ${action.routeName} not found!`,
    );
    return state;
  }

  // A preloaded route is rendered, but its key is not requested.
  return {
    ...state,
    routes: [...state.routes, createRouteFromConfig(routeConfig, true)],
  };
}

function navigationActionSetOptionsHandler(
  state: StackNavigationState,
  action: NavigationActionSetRouteOptions,
): StackNavigationState {
  const routeIndex = state.routes.findIndex(
    route => route.routeKey === action.routeKey,
  );

  if (routeIndex === NOT_FOUND_INDEX) {
    throw new Error(
      `[Stack] Can not set options. Route with key ${action.routeKey} not found`,
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

function navigationActionClearEffectsHandler(
  state: StackNavigationState,
  _action: NavigationActionClearEffects,
): StackNavigationState {
  if (state.effects.length === 0) {
    return state;
  }
  return stateWithEffects(state, []);
}

// #endregion JS actions

// #region Host events

function navStateChangedHandler(
  state: StackNavigationState,
  action: NavigationActionNavStateChanged,
): StackNavigationState {
  const { stack, provenance, actionOrigin } = action.event;

  if (
    state.confirmedState.provenance === provenance &&
    areStacksEqual(state.confirmedState.stack, stack)
  ) {
    console.warn(
      `[Stack] Duplicated state confirmation event! ${safeStringify(
        action.event,
      )}`,
    );
    return state;
  }

  const newState = stateWithConfirmedState(state, { stack, provenance });

  // The host confirmed the current request. An earlier request, or a
  // programmatic change that is not ours, may be confirmed first, in which
  // case the current request is still on its way.
  if (
    actionOrigin === 'programmaticJs' &&
    newState.isRequestInFlight &&
    areStacksEqual(stack, newState.request.stack)
  ) {
    return stateWithSettledRequest(newState);
  }

  // Any other change (e.g. a native pop) only updates the confirmed state:
  // it is never sent back as a request. A request still in flight is based on
  // an older state; the host rejects it as stale if it was overtaken, and the
  // intent is then applied again on top of the state it reports.
  return newState;
}

function navStateRequestRejectedHandler(
  state: StackNavigationState,
  action: NavigationActionNavStateRequestRejected,
): StackNavigationState {
  const {
    stack,
    provenance,
    rejectedStack,
    rejectedBaseProvenance,
    rejectionReason,
  } = action.event;

  let newState: StackNavigationState = {
    ...stateWithConfirmedState(state, { stack, provenance }),
    lastRejection: {
      reason: rejectionReason,
      rejectedStack,
      rejectedBaseProvenance,
    },
  };

  const isCurrentRequest =
    newState.isRequestInFlight &&
    newState.request.baseProvenance === rejectedBaseProvenance &&
    areStacksEqual(newState.request.stack, rejectedStack);

  if (!isCurrentRequest) {
    // A newer request is already on its way, and it carries the whole intent.
    console.info(
      `[Stack] An older request was rejected (${rejectionReason}), waiting for the current one`,
    );
    return newState;
  }

  switch (rejectionReason) {
    case 'stale': {
      // The user (or native code) changed the stack before the request was
      // applied. Apply the intent again on top of the reported state.
      const desiredStack = getDesiredStack(newState);
      if (areStacksEqual(desiredStack, newState.confirmedState.stack)) {
        console.info(
          '[Stack] Stale request: nothing left to apply on top of the current state',
        );
        return stateWithSettledRequest(newState);
      }
      console.info(
        `[Stack] Stale request: applying the intent again on top of ${safeStringify(
          newState.confirmedState,
        )}`,
      );
      newState = stateWithNewRequest(newState, desiredStack);
      return newState;
    }
    case 'repeated': {
      return stateWithSettledRequest(newState);
    }
    case 'invalid': {
      console.error(
        `[Stack] The host rejected request ${safeStringify(
          newState.request,
        )} as invalid. This is a bug in the navigator.`,
      );
      return stateWithSettledRequest(newState);
    }
  }
}

/**
 * Unmounts released routes: the host no longer needs them for an exit
 * transition.
 */
function screensReleasedHandler(
  state: StackNavigationState,
  action: NavigationActionScreensReleased,
): StackNavigationState {
  const releasedKeys = new Set(action.event.screenKeys);
  const desiredStack = getDesiredStack(state);

  const keysToKeep = new Set<string>();
  for (const key of releasedKeys) {
    if (
      state.confirmedState.stack.includes(key) ||
      desiredStack.includes(key)
    ) {
      console.warn(
        `[Stack] Screen ${key} was released, but it is still in the stack. Keeping it rendered.`,
      );
      keysToKeep.add(key);
    }
  }

  const shouldUnmount = (key: string) =>
    releasedKeys.has(key) && !keysToKeep.has(key);

  return {
    ...state,
    routes: state.routes.filter(route => !shouldUnmount(route.routeKey)),
    retiringKeys: state.retiringKeys.filter(key => !releasedKeys.has(key)),
  };
}

// #endregion Host events

// #region Helpers

/**
 * The stack JS wants: the confirmed stack with the intent applied.
 */
function getDesiredStack(state: StackNavigationState): readonly string[] {
  return applyIntent(state.confirmedState.stack, state.intent, state);
}

/**
 * Applies the intent steps to `stack`, skipping steps that no longer make
 * sense, e.g. a pop of a route the user has already popped, or a push of a
 * route the user has already dismissed.
 */
function applyIntent(
  stack: readonly string[],
  intent: readonly StackIntentStep[],
  state: StackNavigationState,
): readonly string[] {
  return intent.reduce<readonly string[]>((currentStack, step) => {
    switch (step.type) {
      case 'push': {
        if (
          currentStack.includes(step.routeKey) ||
          state.retiringKeys.includes(step.routeKey) ||
          !state.routes.some(route => route.routeKey === step.routeKey)
        ) {
          return currentStack;
        }
        return [...currentStack, step.routeKey];
      }
      case 'pop': {
        // An empty stack can not be requested.
        if (!currentStack.includes(step.routeKey) || currentStack.length <= 1) {
          return currentStack;
        }
        return currentStack.filter(key => key !== step.routeKey);
      }
    }
  }, stack);
}

function stateWithNewRequest(
  state: StackNavigationState,
  stack: readonly string[],
): StackNavigationState {
  return {
    ...state,
    request: {
      requestId: state.request.requestId + 1,
      stack,
      baseProvenance: state.confirmedState.provenance,
    },
    isRequestInFlight: true,
  };
}

/**
 * The current request got its answer: drop the intent and unmount routes
 * that were created for it but never made it into the stack.
 */
function stateWithSettledRequest(
  state: StackNavigationState,
): StackNavigationState {
  const { confirmedState, retiringKeys } = state;
  return {
    ...state,
    intent: [],
    isRequestInFlight: false,
    routes: state.routes.filter(
      route =>
        route.isPreloaded ||
        confirmedState.stack.includes(route.routeKey) ||
        retiringKeys.includes(route.routeKey),
    ),
  };
}

/**
 * Adopts a state reported by the host. Keys that left the stack are
 * retiring until the host releases them.
 */
function stateWithConfirmedState(
  state: StackNavigationState,
  confirmedState: StackConfirmedState,
): StackNavigationState {
  if (
    state.confirmedState.provenance === confirmedState.provenance &&
    areStacksEqual(state.confirmedState.stack, confirmedState.stack)
  ) {
    return state;
  }

  const removedKeys = state.confirmedState.stack.filter(
    key => !confirmedState.stack.includes(key),
  );
  const retiringKeys = [
    ...state.retiringKeys.filter(key => !confirmedState.stack.includes(key)),
    ...removedKeys.filter(key => !state.retiringKeys.includes(key)),
  ];

  return {
    ...state,
    confirmedState: {
      stack: [...confirmedState.stack],
      provenance: confirmedState.provenance,
    },
    retiringKeys,
  };
}

function findRouteConfig(
  routeConfigs: readonly StackRouteConfig[],
  routeName: string,
): StackRouteConfig | undefined {
  return routeConfigs.find(config => config.name === routeName);
}

function createRouteFromConfig(
  config: StackRouteConfig,
  isPreloaded: boolean,
): StackRoute {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { element, ...rest } = config;
  return {
    ...rest,
    routeKey: generateRouteKeyForRouteName(config.name),
    isPreloaded,
  };
}

function applyEffect(
  effects: StackNavigationEffect[],
  newEffect: StackNavigationEffect,
): StackNavigationEffect[] {
  return effects.concat(newEffect);
}

function areStacksEqual(
  lhs: readonly string[],
  rhs: readonly string[],
): boolean {
  return (
    lhs.length === rhs.length && lhs.every((key, index) => key === rhs[index])
  );
}

export type StackContainerStateInitArg = {
  routeConfigs: readonly StackRouteConfig[];
  initialRouteNames?: string[] | undefined;
};

export function determineInitialNavigationState(
  arg: StackContainerStateInitArg,
): StackNavigationState {
  const { routeConfigs, initialRouteNames } = arg;

  const routeNames = initialRouteNames ?? [routeConfigs[0].name];

  if (routeNames.length === 0) {
    throw new Error(
      '[Stack] initialRouteNames must contain at least one route name',
    );
  }

  const routes = routeNames.map(routeName => {
    const routeConfig = findRouteConfig(routeConfigs, routeName);
    if (routeConfig == null) {
      throw new Error(
        `[Stack] initialRouteNames entry "${routeName}" does not match any route config name`,
      );
    }
    return createRouteFromConfig(routeConfig, false);
  });

  const stack = routes.map(route => route.routeKey);

  // Unlike the Tabs navigator, nothing is confirmed before the host reports
  // its first state: the initial stack is the first request, based on
  // `Provenance.INITIAL`, and it is applied without animation.
  return {
    routes,
    confirmedState: {
      stack: [],
      provenance: Provenance.INITIAL,
    },
    intent: stack.map(routeKey => ({ type: 'push', routeKey })),
    request: {
      requestId: INITIAL_REQUEST_ID,
      stack,
      baseProvenance: Provenance.INITIAL,
    },
    isRequestInFlight: true,
    retiringKeys: [],
    lastRejection: null,
    effects: [],
  };
}

function generateRouteKeyForRouteName(routeName: string): string {
  return `r-${routeName}-${generateID()}`;
}

function stateWithEffects(
  navState: StackNavigationState,
  newEffects: StackNavigationEffect[],
): StackNavigationState {
  return {
    ...navState,
    effects: newEffects,
  };
}

// #endregion Helpers
