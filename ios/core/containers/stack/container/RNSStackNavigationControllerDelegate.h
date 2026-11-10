#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * UIKit asks it for the animation of every animated push and pop, except a pop started by a swipe
 * (undocumented).
 */
@interface RNSStackNavigationControllerDelegate : NSObject <UINavigationControllerDelegate>

@end

NS_ASSUME_NONNULL_END
