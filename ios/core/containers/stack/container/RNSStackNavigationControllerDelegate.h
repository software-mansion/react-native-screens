#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackTransition;

/**
 * The `UINavigationControllerDelegate` of `RNSStackNavigationController`. The stack owns it, so that the transitions
 * UIKit runs can be configured from the stack's own model.
 *
 * UIKit asks it for the animation of every animated push and pop, except a pop started by a swipe (undocumented).
 */
@interface RNSStackNavigationControllerDelegate : NSObject <UINavigationControllerDelegate>

/**
 * The transition the stack has handed to UIKit and that has not finished yet: its kind and the screens involved.
 * The stack sets it right before the UIKit call that starts the transition. Nil when no such transition is running.
 */
@property (nonatomic, strong, nullable) RNSStackTransition *currentTransition;

@end

NS_ASSUME_NONNULL_END
