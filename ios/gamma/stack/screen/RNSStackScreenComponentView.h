#pragma once

#import "RNSBaseScreenComponentView.h"
#import "RNSStackScreenComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackHostComponentView;

typedef NS_ENUM(int, RNSStackScreenActivityMode) {
  RNSStackScreenActivityModeDetached = 0,
  RNSStackScreenActivityModeAttached = 1,
};

@interface RNSStackScreenComponentView : RNSBaseScreenComponentView

@property (nonatomic, weak, readwrite, nullable) RNSStackHostComponentView *stackHost;
@property (nonatomic, strong, readonly, nonnull) RNSStackScreenController *controller;

@end

#pragma mark - Props

@interface RNSStackScreenComponentView ()

// screenKey is inherited from RNSBaseScreenComponentView
@property (nonatomic, readonly) RNSStackScreenActivityMode activityMode;

@end

#pragma mark - Events

@interface RNSStackScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSStackScreenComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
