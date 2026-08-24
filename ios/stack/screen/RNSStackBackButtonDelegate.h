#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Receiver of a screen's back button configuration.

 On iOS the system back button rendered on the top screen is derived from the
 navigationItem of the screen BELOW, yet react-native-screens configures it via
 headerConfig props on the top screen. This protocol expresses that inversion:
 the screen below the top one acts as the delegate, and the top screen's header
 coordinator hands its back button config down through it.

 The delegate is assigned to the pushed screen controller right before it is
 pushed, so it is available once the header config is applied on push.
 */
@protocol RNSStackBackButtonDelegate <NSObject>

/**
 Applies the given back button configuration onto the receiver's navigationItem.
 */
- (void)applyBackButtonConfigWithTitle:(nullable NSString *)backTitle
                           displayMode:(UINavigationItemBackButtonDisplayMode)displayMode;

@end

NS_ASSUME_NONNULL_END
