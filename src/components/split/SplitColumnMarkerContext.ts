import React from 'react';

/**
 * Whether a `Stack.Host` rendered here asks a `Split.Column` to integrate with
 * it.
 *
 * `Split.Column` provides `true`, unless it has `disableStackIntegration`.
 * Components that render their children in a native container of their own
 * reset it to `false`: `Stack.Screen`, `Tabs.Host`, the sheets and
 * contained modals.
 */
const SplitColumnMarkerContext = React.createContext<boolean>(false);

export default SplitColumnMarkerContext;
