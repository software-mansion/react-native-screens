#pragma once

#import <UIKit/UIKit.h>
#import "RNSViewControllerLifecycleEventsNotifying.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * A component view backed by a navigation controller, which a parent component may install directly
 * in its own view controller hierarchy instead of adding the component view as a subview.
 */
@protocol RNSNavigationControllerProviding <NSObject>

/**
 * The controller reports its lifecycle events to a delegate, so that the parent that installs it can follow them.
 */
@property (nonatomic, strong, readonly, nonnull)
    UINavigationController<RNSViewControllerLifecycleEventsNotifying> *navigationController;

/**
 * Set by the parent that installs `navigationController` itself; while YES the component must not
 * place the controller on its own.
 */
@property (nonatomic, getter=isNavigationControllerPlacedByParent) BOOL navigationControllerPlacedByParent;

/**
 * Applies pending updates of `navigationController` immediately. Called by the parent before it
 * installs the controller.
 */
- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
