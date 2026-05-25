export interface TabsHostPropsAndroid {
  /**
   * @summary Determines whether `BottomNavigationView` applies the inset for IME (i.e. keyboard).
   *
   * This prop should be used with `android:windowSoftInputMode="adjustResize"`.
   *
   * On API prior to 30, setting this prop to `true` has no effect.
   *
   * Changing this prop while the keyboard is open will not take effect immediately.
   * The new value will be applied the next time the keyboard is opened.
   *
   * @default false
   *
   * @platform android
   * @supported API 30 or higher
   */
  tabBarRespectsIMEInsets?: boolean | undefined;

  /**
   * @summary Determines whether window insets should be applied synchronously from the DecorView.
   *
   * By default, the Android system applies window insets with some delay
   * (React Native may calculate the initial layout before the insets are dispatched).
   * This can cause sudden height changes of the bottom tab bar during screen transitions.
   *
   * Setting this prop to `true` fetches and applies the insets manually during the view attachment
   * phase, effectively preventing these visual glitches.
   *
   * Setting this to `false` disables this workaround and falls back to the default asynchronous
   * behavior. This serves as an opt-out mechanism if the synchronous application causes
   * conflicts with other inset-handling configurations or unexpected UI side-effects.
   *
   * @default true
   *
   * @platform android
   */
  tabBarShouldApplyInsetsSynchronously?: boolean;
}
