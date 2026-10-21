#pragma once

#import "RNSScreen.h"

@interface RNSScreenStackAnimator : NSObject <UIViewControllerAnimatedTransitioning>

/// This property is filled whenever there is an ongoing animation and cleared on animation end.
@property (nonatomic, strong, nullable, readonly) UIViewPropertyAnimator *inFlightAnimator;

- (nonnull instancetype)initWithOperation:(UINavigationControllerOperation)operation;

+ (BOOL)isCustomAnimation:(RNSScreenStackAnimation)animation;

@end
