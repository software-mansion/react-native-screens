#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackHostComponentView;
@class RNSStackNavigationController;

@protocol RNSStackHostDelegate <NSObject>

/**
 * Asked once, when the host needs its navigation controller. The host creates one itself when there is no delegate or
 * the delegate returns `nil`.
 */
- (nullable RNSStackNavigationController *)navigationControllerForStackHost:(RNSStackHostComponentView *)stackHost;

@end

NS_ASSUME_NONNULL_END
