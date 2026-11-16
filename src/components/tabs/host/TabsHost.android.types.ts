export interface TabsHostPropsAndroid {
  /**
   * Determines whether `BottomNavigationView` applies the inset for IME (i.e.
   * keyboard).
   *
   * @remarks
   * This prop should be used with `android:windowSoftInputMode="adjustResize"`.
   *
   * Changing this prop while the keyboard is open will not take effect
   * immediately. The new value will be applied the next time the keyboard is
   * opened.
   *
   * @defaultValue `false`
   * @platform android >= 30
   */
  tabBarRespectsIMEInsets?: boolean | undefined;
}
