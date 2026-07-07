#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackHeaderConfigDataProviding.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderConfigComponentView : RNSReactBaseView <RNSViewFrameChangeDelegate,
                                                                 RNSStackHeaderConfigDataProviding,
                                                                 RNSStackHeaderItemInvalidationDelegate,
                                                                 RNSStackHeaderEventsDelegate>

@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) NSString *subtitle;
@property (nonatomic, readonly) BOOL hidden;
@property (nonatomic, readonly, nullable) NSString *largeTitle;
@property (nonatomic, readonly, nullable) NSString *largeSubtitle;
@property (nonatomic, readonly) BOOL largeTitleEnabled;
@property (nonatomic, readonly) NSArray<id> *children;

- (void)resetProps;

@end

NS_ASSUME_NONNULL_END

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

#import <rnscreens/RNSStackHeaderConfigComponentDescriptor.h>

@interface RNSStackHeaderConfigComponentView ()

- (facebook::react::RNSStackHeaderConfigShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)
