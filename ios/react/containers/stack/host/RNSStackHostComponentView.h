#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackNavigationController;

@interface RNSStackHostComponentView : RNSReactBaseView

@property (nonatomic, readonly) BOOL headlessModeEnabled;

/**
 * The navigation controller of the stack. A host in headless mode does not add it to the view controller hierarchy,
 * so the component the host is rendered in has to do it.
 */
@property (nonatomic, readonly) RNSStackNavigationController *stackNavigationController;

/**
 * Identifies the stack as a provider of the presentation context of contained modals. Nil when not set.
 */
@property (nonatomic, readonly, nullable) NSString *modalProviderContainerId;

@end

#pragma mark - Communication with StackScreen

@interface RNSStackHostComponentView ()

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
