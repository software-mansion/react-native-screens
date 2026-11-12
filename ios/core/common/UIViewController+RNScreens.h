#pragma once

#import <UIKit/UIKit.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface UIViewController (RNScreens)

#if !TARGET_OS_TV
/**
 * Mask of `orientation`. `RNSOrientationInherit` resolves to the orientations the app supports for this controller's
 * window.
 */
- (UIInterfaceOrientationMask)reactNativeScreensInterfaceOrientationMaskForOrientation:(RNSOrientation)orientation;
#endif // !TARGET_OS_TV

@end

NS_ASSUME_NONNULL_END
