#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackHeaderConfigComponentView;

typedef NS_ENUM(int, RNSStackScreenActivityMode) {
  RNSStackScreenActivityModeDetached = 0,
  RNSStackScreenActivityModeAttached = 1,
};

@protocol RNSStackScreenProviding <NSObject>

- (nonnull UIViewController *)controller;

- (RNSStackScreenActivityMode)activityMode;

- (nullable NSString *)screenKey;

- (nullable RNSStackHeaderConfigComponentView *)headerConfig;

@end

NS_ASSUME_NONNULL_END
