#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * A navigation container (e.g. stack, tabs) that hosts items and can resolve the content scroll
 * view of whichever item is currently presented.
 *
 * On iOS the concept is implemented at the view-controller level: `RNSStackNavigationController`
 * and `RNSTabBarController` conform to this protocol.
 */
@protocol RNSContainer <NSObject>

/**
 * A container can host multiple items, each with its own content scroll view. It is up to the
 * implementer to decide which scroll view to return here (if any) for the item that is currently
 * presented.
 */
- (nullable UIScrollView *)resolveCurrentContentScrollView;

@end

NS_ASSUME_NONNULL_END
