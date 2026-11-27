#pragma once

#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackHostComponentView;
@class RNSStackHeaderConfigComponentView;

@interface RNSStackScreenComponentView : RNSReactBaseView <RNSSafeAreaProviding>

@property (nonatomic, weak, readwrite, nullable) RNSStackHostComponentView *stackHost;
@property (nonatomic, weak, readonly, nullable) RNSStackHeaderConfigComponentView *headerConfig;
@property (nonatomic, strong, readonly, nonnull) RNSStackScreenController *controller;

@end

#pragma mark - Props

@interface RNSStackScreenComponentView ()

@property (nonatomic, strong, readonly, nullable) NSString *screenKey;

@end

NS_ASSUME_NONNULL_END
