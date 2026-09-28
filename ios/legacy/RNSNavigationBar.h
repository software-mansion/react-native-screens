#pragma once

#import <UIKit/UIKit.h>
#import "RNSDefines.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@protocol RNSNavigationBarLayoutDelegate <NSObject>

- (void)navigationBarDidLayoutSubviews:(UINavigationBar *)navigationBar;

@end

/**
 * Navigation bar used by the legacy stack (`RNSNavigationController`) on iOS 27+.
 *
 * It reports its layout passes to the `layoutDelegate`, so that the header height can follow
 * the iOS 27 bar minimization, which changes only the bar's subviews and not the bar's own frame.
 */
@interface RNSNavigationBar : UINavigationBar

@property (nonatomic, weak, nullable) id<RNSNavigationBarLayoutDelegate> layoutDelegate;

@end

NS_ASSUME_NONNULL_END

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV
