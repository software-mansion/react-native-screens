import Foundation
import UIKit

@objc
public class RNSStackNavigationAppearanceCoordinator: NSObject {
  @objc
  func updateNavigationAppearance(navigationBar: UINavigationBar, viewControllers: [RNSStackScreenController]) {
    for viewController in viewControllers {
      if (!viewController.needsNavigationAppearanceUpdate) {
        continue
      }
      
      // TODO: Improve once more props is available
      viewController.navigationItem.title = viewController.stackHeaderApperance?.title
      
      viewController.didHeaderUpdated()
    }
  }
  
  
}
