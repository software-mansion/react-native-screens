#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackNavigationController;

@interface RNSStackHostComponentView : RNSReactBaseView

@end

#pragma mark - External navigation controller

@interface RNSStackHostComponentView ()

/**
 * The navigation controller the host operates on, for a host with `usesExternalNavigationController`, which does not
 * create one itself. Setting it applies the operations collected so far to the controller.
 */
@property (nonatomic, strong, nullable) RNSStackNavigationController *externalNavigationController;

@end

#pragma mark - Communication with StackScreen

@interface RNSStackHostComponentView ()

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
