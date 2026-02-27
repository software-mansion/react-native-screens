///
/// @brief - A collection of flags, which can be invalidated on RNSSplitHostController to apply proper updates to SplitView
///
struct RNSSplitAppearanceUpdateFlags: OptionSet {
  let rawValue: UInt8

  static let generalUpdate = RNSSplitAppearanceUpdateFlags(rawValue: 1 << 0)
  static let secondaryScreenNavBarUpdate = RNSSplitAppearanceUpdateFlags(rawValue: 1 << 1)
  static let displayModeUpdate = RNSSplitAppearanceUpdateFlags(rawValue: 1 << 2)
  static let orientationUpdate = RNSSplitAppearanceUpdateFlags(rawValue: 1 << 3)
}
