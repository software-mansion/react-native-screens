#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewFrameChangeDelegate;

/**
 * @class RNSSplitColumnNavigationControllerFrameObserver
 * @brief Class responsible for observing frame origin changes of the view of a Split column's navigation controller
 * and reporting them to its delegate.
 */
@interface RNSSplitColumnNavigationControllerFrameObserver : NSObject

- (instancetype)initWithNavigationController:(UINavigationController *)navigationController
                                    delegate:(id<RNSViewFrameChangeDelegate>)delegate;

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
