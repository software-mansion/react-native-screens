///
/// @brief - A collection of flags, which can be invalidated on RNSSplitViewHostController to apply proper updates to SplitView
///
struct RNSSplitViewAppearanceUpdateFlags: OptionSet {
  let rawValue: UInt8

  static let generalUpdate = RNSSplitViewAppearanceUpdateFlags(rawValue: 1 << 0)
  static let secondaryScreenNavBarUpdate = RNSSplitViewAppearanceUpdateFlags(rawValue: 1 << 1)
  static let displayModeUpdate = RNSSplitViewAppearanceUpdateFlags(rawValue: 1 << 2)
  static let orientationUpdate = RNSSplitViewAppearanceUpdateFlags(rawValue: 1 << 3)
}
