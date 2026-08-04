#pragma once

#import <UIKit/UIKit.h>
#import "RNSScreenStackAnimator.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSPercentDrivenInteractiveTransition : UIPercentDrivenInteractiveTransition

@property (nonatomic, nullable) RNSScreenStackAnimator *animationController;

@end

NS_ASSUME_NONNULL_END
