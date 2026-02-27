///
/// @brief - A class that is responsible for coordinating SplitHost appearance updates.
///
/// It collects flags for Split appearance update actions and invalidates them.
/// It's also responsible for executing callbacks when the action is requested.
///
final class RNSSplitAppearanceCoordinator {
  var updateFlags: RNSSplitAppearanceUpdateFlags = []

  public func needs(_ updateFlag: RNSSplitAppearanceUpdateFlags) {
    updateFlags.insert(updateFlag)
  }

  public func updateIfNeeded(
    _ updateFlag: RNSSplitAppearanceUpdateFlags, _ updateCallback: () -> Void
  ) {
    if isNeeded(updateFlag) {
      updateFlags.remove(updateFlag)
      updateCallback()
    }
  }

  func isNeeded(_ updateFlag: RNSSplitAppearanceUpdateFlags) -> Bool {
    updateFlags.contains(updateFlag)
  }
}
