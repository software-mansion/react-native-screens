#import <Foundation/Foundation.h>

@class RNSSplitViewNavigationController;

/// @brief A protocol that observes origin changes in a RNSSplitViewNavigationController’s view frame.
/// The subscriber will be notified when the view's origin changes.
@protocol RNSSplitViewNavigationControllerViewFrameObserver <NSObject>

- (void)splitViewNavCtrlViewDidChangeFrameOrigin:(RNSSplitViewNavigationController *)splitViewNavCtrl;

@end