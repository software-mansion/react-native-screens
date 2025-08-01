import Foundation
import UIKit

@objc
public class RNSStackNavigationAppearanceCoordinator: NSObject {
  @objc
  func updateNavigationBarAppearance(navigationBar: UINavigationBar, viewControllers: [RNSStackScreenController]) {
    for viewController in viewControllers {
      if (!viewController.needsNavigationBarAppearanceUpdate) {
        continue
      }
      
      // TODO: Improve once more props is available
      viewController.navigationItem.title = viewController.navigationAppearance?.title
      
      viewController.navigationBarAppearanceDidUpdate()
    }
  }
  
  
}
