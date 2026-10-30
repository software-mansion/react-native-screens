#pragma once

#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackHostComponentView;
@class RNSStackHeaderConfigComponentView;

typedef NS_ENUM(int, RNSStackScreenActivityMode) {
  RNSStackScreenActivityModeDetached = 0,
  RNSStackScreenActivityModeAttached = 1,
};

@interface RNSStackScreenComponentView : RNSReactBaseView <RNSSafeAreaProviding>

@property (nonatomic, weak, readwrite, nullable) RNSStackHostComponentView *stackHost;
@property (nonatomic, weak, readonly, nullable) RNSStackHeaderConfigComponentView *headerConfig;
@property (nonatomic, strong, readonly, nonnull) RNSStackScreenController *controller;
@property (nonatomic, readonly) BOOL isNativelyDismissed;

@end

#pragma mark - Props

@interface RNSStackScreenComponentView ()

@property (nonatomic, strong, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly) RNSStackScreenActivityMode activityMode;

@end

NS_ASSUME_NONNULL_END
