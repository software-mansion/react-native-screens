export interface TabsHostPropsAndroid {
  /**
   * @summary Determines whether `BottomNavigationView` applies the inset for IME (i.e. keybaord).
   *
   * This prop should be used with `android:windowSoftInputMode="adjustResize"`.
   *
   * On API prior to 30, setting this prop to `true` has no effect.
   *
   * @default false
   *
   * @platform android
   * @supported API 30 or higher
   */
  tabBarRespectsIMEInsets?: boolean;
}
