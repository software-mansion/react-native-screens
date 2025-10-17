#import <UIKit/UIKit.h>
#import "RNSSplitViewNavigationControllerViewFrameObserver.h"

/// @class RNSSplitViewNavigationController
/// @brief A UINavigationController subclass used inside SplitView for tracking frame origin changes.
@interface RNSSplitViewNavigationController : UINavigationController

@property (nonatomic, weak) id<RNSSplitViewNavigationControllerViewFrameObserver> viewFrameOriginChangeObserver;

@end