#pragma once

#import <UIKit/UIKit.h>
#import "RNSSplitNavigationController.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSSplitNavigationControllerFrameOriginChangeDelegate;

/**
 * @class RNSSplitNavigationControllerFrameObserver
 * @brief Class responsible for observing frame origin changes of RNSSplitNavigationController's view.
 */
@interface RNSSplitNavigationControllerFrameObserver : NSObject

- (instancetype)initWithSplitNavigationController:(RNSSplitNavigationController *)navigationController
                                         delegate:(nullable id<RNSSplitNavigationControllerFrameOriginChangeDelegate>)
                                                      frameOriginChangeDelegate;

/**
 * Registers KVO for the frame of navigation controller's view.
 * It must be called after the navigation controller's view is loaded.
 */
- (void)registerForViewFrameChanges;
/**
 * Removes the KVO registration set up by `registerForViewFrameChanges`.
 */
- (void)unregisterForViewFrameChanges;

@end

NS_ASSUME_NONNULL_END
