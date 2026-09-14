#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(int, RNSStackScreenActivityMode) {
  RNSStackScreenActivityModeDetached = 0,
  RNSStackScreenActivityModeAttached = 1,
};

@protocol RNSStackScreenProviding <NSObject>

- (nonnull UIViewController *)stackScreenController;

- (RNSStackScreenActivityMode)activityMode;

- (nullable NSString *)screenKey;

- (nullable UIView *)stackHeaderConfig;

@end

NS_ASSUME_NONNULL_END
