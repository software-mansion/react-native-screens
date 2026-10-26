#pragma once

#import "RNSImageLoading.h"
#import "RNSReactBaseView.h"
#import "RNSStackHeaderConfigDataProviding.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSStackScreenHeaderCoordinator.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderConfigComponentView : RNSReactBaseView <RNSViewFrameChangeDelegate,
                                                                 RNSStackHeaderConfigDataProviding,
                                                                 RNSStackHeaderItemInvalidationDelegate,
                                                                 RNSStackHeaderEventsDelegate,
                                                                 RNSImageLoading>

@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) NSString *subtitle;
@property (nonatomic, readonly) BOOL hidden;
@property (nonatomic, readonly, nullable) NSString *largeTitle;
@property (nonatomic, readonly, nullable) NSString *largeSubtitle;
@property (nonatomic, readonly) BOOL largeTitleEnabled;
@property (nonatomic, readonly, nullable) NSString *prompt;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)
@property (nonatomic, readonly) UIBarMinimizationBehavior minimizationBehavior API_AVAILABLE(ios(27.0));
@property (nonatomic, readonly) UIBarMinimizationRestorationBehavior restorationBehavior API_AVAILABLE(ios(27.0));
#endif // Check for iOS >= 27
@property (nonatomic, readonly, nullable) NSString *backButtonTitle;
@property (nonatomic, readonly) UINavigationItemBackButtonDisplayMode backButtonDisplayMode;
@property (nonatomic, readonly) BOOL backButtonMenuEnabled;
@property (nonatomic, readonly, nullable) RNSStackHeaderMenuData *titleMenu;
@property (nonatomic, readonly, nullable) UINavigationBarAppearance *standardAppearance;
@property (nonatomic, readonly, nullable) UINavigationBarAppearance *scrollEdgeAppearance;
@property (nonatomic, readonly) NSArray<id> *children;

@property (nonatomic, weak, nullable) RNSStackScreenHeaderCoordinator *headerCoordinator;

- (void)resetProps;

@end

NS_ASSUME_NONNULL_END

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

#import <react/renderer/components/rnscreens/RNSStackHeaderConfigComponentDescriptor.h>

@interface RNSStackHeaderConfigComponentView ()

- (facebook::react::RNSStackHeaderConfigShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)
