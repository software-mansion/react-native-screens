#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/** Holds a single interruptible push at zero until the destination is ready. */
@interface RNSStackDeferredPush : UIPercentDrivenInteractiveTransition

- (void)releasePush;

@end

NS_ASSUME_NONNULL_END
