/**
 * iOS-specific props for {@link Stack.Screen}.
 */
export interface StackScreenPropsIOS {
  /**
   * Whether the user can pop this screen with the back gesture.
   *
   * @remarks
   * The header back button and its menu still pop the screen.
   *
   * @defaultValue `true`
   * @platform ios
   */
  backGestureEnabled?: boolean | undefined;
  /**
   * Whether the back gesture is recognized anywhere on this screen, not only
   * at its leading edge.
   *
   * @remarks
   * Has no effect while
   * {@link StackScreenPropsIOS.backGestureEnabled | backGestureEnabled} is
   * `false`. A gesture that starts away from the edge yields to horizontal
   * scroll views, as the system decides.
   *
   * @note
   * Below iOS 26 the system has no full-screen back gesture and the prop has no
   * effect.
   *
   * @defaultValue `true`
   * @platform ios
   */
  fullScreenBackGestureEnabled?: boolean | undefined;
}
