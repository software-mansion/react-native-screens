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
}
