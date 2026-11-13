import React from 'react';

/**
 * Whether the component is rendered as the content of a `Split.Column` that
 * integrates with a stack.
 *
 * `Split.Column` provides `true`, unless it has `disableStackIntegration`, and
 * `Stack.Screen` resets it to `false`. A `Stack.Host` reads `true` only when
 * it is the content of a column, not when it is nested in a screen of another
 * stack.
 */
const SplitColumnMarkerContext = React.createContext<boolean>(false);

export default SplitColumnMarkerContext;
