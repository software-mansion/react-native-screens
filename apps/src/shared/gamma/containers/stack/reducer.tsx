import type {
  NavigationAction,
  NavigationActionNativePop,
  NavigationActionPop,
  NavigationActionPopCompleted,
  NavigationActionPush,
  StackRoute,
  StackRouteConfig,
  StackState,
} from './StackContainerV2.types';
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
    case 'pop-complated': {
      return navigationActionPopCompletedHandler(state, action);
    }
    case 'pop-native': {
      return navigationActionNativePopHandler(state, action);
    }
  }
  // @ts-expect-error: exhaustive switch
  throw new Error(
    `[Stack] Unhandled navigation action: ${JSON.stringify(action)}`,
  );
}

function navigationActionPushHandler(
  state: StackState,
  action: NavigationActionPush,
): StackState {
  // 1 - Check whether the route is already rendered
  const renderedRouteIndex = state.findIndex(
    route => route.name === action.routeName,
  );
  if (renderedRouteIndex !== NOT_FOUND_INDEX) {
    const newState = [...state];
    const route = newState[renderedRouteIndex];

    if (route.activityMode === 'attached') {
      console.info(
        `[Stack] Unable to push route with name: ${action.routeName}, route is already pushed`,
      );
    } else {
      route.activityMode = 'attached';
      return newState;
    }
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
  // FIXME: This modifes existing state, possibly impacting calculations done before new state is updated.
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
      `[Stack] Can not perform 'pop-complated' action - popped screen is no longer in state!`,
    );
    return state;
  }

  // Let's remove the route from the state
  // TODO: Consider adding option for keeping it in state.
  const newState = state.splice(routeIndex, 1);
  return newState;
}

function navigationActionNativePopHandler(
  _state: StackState,
  _action: NavigationActionNativePop,
): StackState {
  throw new Error('[Stack] pop-native action is not supported yet');
}

function createRouteFromConfig(config: StackRouteConfig): StackRoute {
  return {
    ...config,
    activityMode: 'detached',
    routeKey: generateRouteKeyForRouteName(config.name),
  };
}

function generateRouteKeyForRouteName(routeName: string): string {
  return `route-${routeName}-${generateID()}`;
}
