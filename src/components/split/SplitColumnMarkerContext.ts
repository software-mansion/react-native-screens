import React from 'react';

/**
 * Whether the component is rendered as the direct content of a `Split.Column`.
 *
 * `Split.Column` provides `true` and `Stack.Screen` resets it to `false`, so a
 * `Stack.Host` reads `true` only when it is the column's content, not when it
 * is nested in a screen of another stack. Such a host renders with
 * `display: contents` on iOS and the Split installs its navigation controller
 * in the column.
 */
const SplitColumnMarkerContext = React.createContext<boolean>(false);

export default SplitColumnMarkerContext;
