import React from 'react';
import type { ScrollToTopGuardProps } from './ScrollToTopGuard.types';

/**
 * Prevents taps on the wrapped header content from also scrolling the screen's
 * scroll view to the top.
 *
 * @remarks
 * Temporary workaround for an issue on `react-native`'s side: a tap on a
 * `Pressable` also reaches the system, so a `Pressable` in the header both
 * runs its action and scrolls the scroll view to the top. Wrap such header
 * content with this component. The component will be removed in the future.
 *
 * On iPhone, the component has an effect from iOS 27.
 *
 * Falls back to `React.Fragment` on platforms other than iOS.
 *
 * @see {@link https://github.com/react/react-native/issues/56061 | The issue report}
 * @platform ios >= 26
 * @experimental
 */
function ScrollToTopGuard({ children }: ScrollToTopGuardProps) {
  return <>{children}</>;
}

export { ScrollToTopGuard };
