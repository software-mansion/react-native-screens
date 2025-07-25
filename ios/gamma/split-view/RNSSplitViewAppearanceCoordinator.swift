///
/// @brief - A class that is responsible for coordinating SplitViewHost appearance updates.
///
/// It collects flags for SplitView appearance update actions and invalidates them.
/// It's also responsible for executing callbacks when the action is requested.
///
final class RNSSplitViewAppearanceCoordinator {
  var updateFlags: RNSSplitViewAppearanceUpdateFlags = []

  public func needs(_ updateFlag: RNSSplitViewAppearanceUpdateFlags) {
    updateFlags.insert(updateFlag)
  }

  public func updateIfNeeded(
    _ updateFlag: RNSSplitViewAppearanceUpdateFlags, _ updateCallback: () -> Void
  ) {
    if isNeeded(updateFlag) {
      updateFlags.remove(updateFlag)
      updateCallback()
    }
  }

  func isNeeded(_ updateFlag: RNSSplitViewAppearanceUpdateFlags) -> Bool {
    updateFlags.contains(updateFlag)
  }
}
