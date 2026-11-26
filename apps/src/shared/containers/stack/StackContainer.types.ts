import React from 'react';
import {
  StackScreenProps,
  StackHeaderConfigProps,
  StackHeaderConfigRef,
  StackHostProps,
  StackNavStateChangedEvent,
  StackNavStateRejectionReason,
  StackNavStateRequest,
  StackNavStateRequestRejectedEvent,
  StackScreensReleasedEvent,
} from 'react-native-screens';
import type { RouteNameFromConfigs } from '../shared/route-name';

/// Route definition

export type StackRouteOptions = Omit<
  StackScreenProps,
  'children' | 'screenKey'
> & {
  headerConfig?: StackHeaderConfigProps | undefined;
  headerConfigRef?: React.Ref<StackHeaderConfigRef> | undefined;
};

/**
 * Blueprint for a route.
 */
export type StackRouteConfig = {
  name: string;
  element: React.ReactElement;
  options?: StackRouteOptions;
};

/**
 * A route instance, rendered as one `Stack.Screen` child of the host.
 *
 * Being rendered and being in the stack are two different things: the host
 * holds the stack, and the routes are only the pool of screens it picks from
 * by key (`routeKey` is passed as the screen's `screenKey`).
 */
export type StackRoute = Omit<StackRouteConfig, 'element'> & {
  routeKey: StackScreenProps['screenKey'];
  /**
   * Whether the route was preloaded and has not been pushed since. Such a
   * route is rendered, but it is not in the stack, and `push` of a route with
   * the same name reuses it instead of creating a new one.
   */
  isPreloaded: boolean;
};

/// StackContainer props

export type StackContainerProps<
  TRouteConfigs extends readonly StackRouteConfig[] = StackRouteConfig[],
> = Omit<StackHostProps, 'children' | 'ref' | 'navStateRequest'> & {
  routeConfigs: TRouteConfigs;
  /**
   * @summary
   * Names of the routes that make up the initial stack, from the bottom to
   * the top, so the last one ends up on top.
   *
   * Every name must match one of the `routeConfigs` names. Unlike
   * `routeConfigs` names, the entries here do not have to be unique —
   * a repeated name results in another independent route instance,
   * exactly as if it was pushed at runtime.
   *
   * Defaults to the first route config if not provided.
   */
  initialRouteNames?:
    | NoInfer<RouteNameFromConfigs<TRouteConfigs>>[]
    | undefined;
};

export type PushActionMethod = (routeName: string) => void;
export type PopActionMethod = (routeKey: string) => void;
export type PreloadActionMethod = (routeName: string) => void;
export type BatchActionMethod = (actions: BatchableNavigationAction[]) => void;
export type SetRouteOptionsActionMethod = (
  routeKey: string,
  options: Partial<StackRouteOptions>,
) => void;
export type ClearEffectsActionMethod = () => void;

export type NavigationActionMethods = {
  pushAction: PushActionMethod;
  popAction: PopActionMethod;
  preloadAction: PreloadActionMethod;
  batchAction: BatchActionMethod;
  clearEffectsAction: ClearEffectsActionMethod;
  /**
   * Change options for the current route. This does not modify a blueprint
   * (StackRouteConfig) for the route. It only modifies options for the
   * given route instance.
   */
  setRouteOptions: SetRouteOptionsActionMethod;
};

/// Navigation state

/**
 * Stack state reported by the host, through `onNavStateChanged` or
 * `onNavStateRequestRejected`.
 */
export type StackConfirmedState = {
  /** Route keys from the bottom to the top of the stack. */
  stack: readonly string[];
  /** Opaque, passed back as the base of the next request. */
  provenance: number;
};

/**
 * A change of the stack JS wants, kept until the host confirms it, so that it
 * can be applied again on top of a newer state after a `'stale'` rejection.
 *
 * Steps refer to route instances by key: re-applying a push never creates a
 * new route.
 */
export type StackIntentStep =
  | { type: 'push'; routeKey: string }
  | { type: 'pop'; routeKey: string };

/**
 * Last rejection of a request of this navigator, kept for debugging and for
 * test screens.
 */
export type StackLastRejection = {
  reason: StackNavStateRejectionReason;
  rejectedStack: readonly string[];
  rejectedBaseProvenance: number;
};

/**
 * State of the reference stack navigator.
 *
 * It follows the lazy flow (RFC-1028, RFC-1941): the navigator keeps the
 * state last confirmed by the host and the request it sent, and treats a
 * change as done only once the host confirms it. It never sends a confirmed
 * state back as a request.
 */
export type StackNavigationState = {
  /**
   * Pool of rendered routes, in the order they were created. The children of
   * the host are rendered in this order, so no child ever moves.
   */
  routes: StackRoute[];
  /**
   * Last state reported by the host. Before the first report it is an empty
   * stack with `Provenance.INITIAL`.
   */
  confirmedState: StackConfirmedState;
  /**
   * Changes JS made since the last state that fully matched its request, in
   * order. The desired stack is the confirmed stack with these steps applied.
   * Empty once the host confirmed the request.
   */
  intent: StackIntentStep[];
  /**
   * Request passed to the host. A new `requestId` is the only thing that
   * makes the host handle it, so the object is replaced only when JS wants a
   * new stack.
   */
  request: StackNavStateRequest;
  /**
   * Whether the host has not yet answered `request`, with either a matching
   * `onNavStateChanged` or a rejection.
   */
  isRequestInFlight: boolean;
  /**
   * Keys that left the confirmed stack and have not been released by the
   * host yet. Their routes stay rendered so their content is visible during
   * the exit transition, and they cannot be pushed again (RFC-1941 valid
   * target rule 4).
   */
  retiringKeys: readonly string[];
  lastRejection: StackLastRejection | null;
  effects: StackNavigationEffect[];
};

export type StackNavigationEffect = PopContainerStackNavigationEffect;

type PopContainerStackNavigationEffect = {
  type: 'pop-container';
};

/// Actions

export type NavigationActionPush = {
  type: 'push';
  routeName: string;
  ctx: NavigationActionContext;
};

/**
 * Removes the route from the desired stack. Popping the top is a regular pop,
 * popping a route below it removes it without a transition.
 */
export type NavigationActionPop = {
  type: 'pop';
  routeKey: string;
  ctx: NavigationActionContext;
};

/**
 * Renders a route without adding it to the stack.
 */
export type NavigationActionPreload = {
  type: 'preload';
  routeName: string;
  ctx: NavigationActionContext;
};

/**
 * Applies all actions and sends the result as a single request.
 */
export type NavigationActionBatch = {
  type: 'batch';
  actions: BatchedNavigationAction[];
};

// TODO: We need to separate navigation actions exposed to user from internal
// state manipulation done in stack container on the type level.
export type NavigationActionClearEffects = {
  type: 'clear-effects';
  ctx: NavigationActionContext;
};

export type NavigationActionSetRouteOptions = {
  type: 'set-options';
  routeKey: string;
  options: Partial<StackRouteOptions>;
  ctx: NavigationActionContext;
};

/// Host events, dispatched as actions

export type NavigationActionNavStateChanged = {
  type: 'nav-state-changed';
  event: StackNavStateChangedEvent;
};

export type NavigationActionNavStateRequestRejected = {
  type: 'nav-state-request-rejected';
  event: StackNavStateRequestRejectedEvent;
};

export type NavigationActionScreensReleased = {
  type: 'screens-released';
  event: StackScreensReleasedEvent;
};

export type NavigationActionContext = {
  routeConfigs: readonly StackRouteConfig[];
};

export type BatchableNavigationAction =
  | Omit<NavigationActionPush, 'ctx'>
  | Omit<NavigationActionPop, 'ctx'>
  | Omit<NavigationActionPreload, 'ctx'>
  | Omit<NavigationActionSetRouteOptions, 'ctx'>;

export type BatchedNavigationAction =
  | NavigationActionPush
  | NavigationActionPop
  | NavigationActionPreload
  | NavigationActionSetRouteOptions;

export type NavigationAction =
  | BatchedNavigationAction
  | NavigationActionBatch
  | NavigationActionClearEffects
  | NavigationActionNavStateChanged
  | NavigationActionNavStateRequestRejected
  | NavigationActionScreensReleased;
