import Foundation
import UIKit

/// @class RNSBaseScreenController
/// @brief Base UIViewController for gamma stack and split screen controllers.
///
/// Provides shared lifecycle event emission and dismiss detection, both of which are
/// identical between RNSStackScreenController and RNSSplitScreenController.
///
/// Subclasses must override:
/// - `screenEventEmitter` — return the component view's event emitter.
/// - `isAttached` — return true when the screen's activityMode is .attached.
///
/// Subclasses may override:
/// - `preventNativeDismiss` — return true to suppress UIKit-level back-gesture dismiss.
@objc
public class RNSBaseScreenController: UIViewController {

  // MARK: Abstract interface (override in subclasses)

  /// The event emitter used to send lifecycle and dismiss events to React Native.
  /// Returns nil in the base — subclasses must override.
  @objc
  open var screenEventEmitter: RNSScreenEventEmitting? { nil }

  /// Whether the screen is currently in the attached (active) state.
  /// Used to distinguish JS-driven dismiss from native back-gesture dismiss.
  @objc
  open var isAttached: Bool { false }

  /// Whether native back-gesture dismiss should be suppressed.
  /// UIKit-level gesture blocking is the subclass's responsibility.
  @objc
  open var preventNativeDismiss: Bool { false }

  // MARK: Lifecycle events

  public override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    screenEventEmitter?.emitOnWillAppear()
  }

  public override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    screenEventEmitter?.emitOnDidAppear()
  }

  public override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    screenEventEmitter?.emitOnWillDisappear()
  }

  public override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated)
    screenEventEmitter?.emitOnDidDisappear()
  }

  // MARK: Dismiss detection

  public override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent)

    if parent == nil {
      // If activityMode is still attached when removed, it was a native back gesture.
      if isAttached {
        screenEventEmitter?.emitOnNativeDismiss()
      } else {
        screenEventEmitter?.emitOnDismiss()
      }
    }
  }
}
