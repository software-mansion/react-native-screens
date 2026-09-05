#pragma once

#import <React/RCTViewComponentView.h>
#import "RNSImageLoading.h"
#import "RNSStackHeaderConfigDataProviding.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSStackScreenHeaderCoordinator.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderConfigComponentView : RCTViewComponentView <RNSViewFrameChangeDelegate,
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

#import <rnscreens/RNSStackHeaderConfigComponentDescriptor.h>

@interface RNSStackHeaderConfigComponentView ()

- (facebook::react::RNSStackHeaderConfigShadowNode::ConcreteState::Shared)state;

@end
