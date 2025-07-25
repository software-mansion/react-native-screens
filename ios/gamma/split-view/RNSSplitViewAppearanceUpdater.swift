/// @brief - A class that manages the actions to take after invalidating appearance flags.

@objc
final class RNSSplitViewAppearanceUpdater: NSObject {
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
