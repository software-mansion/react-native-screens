#pragma once

#import <UIKit/UIKit.h>
#import "RNSDefines.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@protocol RNSNavigationBarLayoutDelegate <NSObject>

- (void)navigationBarDidLayoutSubviews:(UINavigationBar *)navigationBar;

@end

/**
 * Navigation bar used by the legacy stack (`RNSNavigationController`).
 *
 * It reports its layout passes to the `layoutDelegate`. On iOS 26+ UIKit can move the content of the navigation bar
 * (e.g. on rotation or fold of iPhone Duo, or during the bar minimization on iOS 27) without any layout pass of the
 * navigation controller's view, and layout of the bar is the only callback we receive in such a case.
 */
@interface RNSNavigationBar : UINavigationBar

@property (nonatomic, weak, nullable) id<RNSNavigationBarLayoutDelegate> layoutDelegate;

@end

NS_ASSUME_NONNULL_END

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
