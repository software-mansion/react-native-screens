import Foundation
import UIKit

@objc
public class RNSStackHeaderAppearanceCoordinator: NSObject {
  @objc
  func updateAppearanceOfHeader(navigationBar: UINavigationBar, viewControllers: [RNSStackScreenController]) {
    for viewController in viewControllers {
      if (!viewController.needsHeaderAppearanceUpdate) {
        continue
      }
      
      // TODO: Improve once more props is available
      viewController.navigationItem.title = viewController.stackHeaderApperance?.title
      
      viewController.didHeaderUpdated()
    }
  }
  
  
}
