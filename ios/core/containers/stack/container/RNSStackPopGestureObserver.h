#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackNavigationController;

/**
 * Notified at `Began` of a pop gesture recognizer of the navigation controller, after UIKit's own handler has started
 * the pop. A swipe that is refused or loses arbitration never begins.
 */
@protocol RNSStackPopGestureObserver <NSObject>

- (void)stackNavigationControllerPopGestureDidBegin:(RNSStackNavigationController *)navigationController;

@end

NS_ASSUME_NONNULL_END
