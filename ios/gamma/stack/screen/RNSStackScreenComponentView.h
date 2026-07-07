#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackHostComponentView;
@class RNSStackHeaderConfigComponentView;

typedef NS_ENUM(int, RNSStackScreenActivityMode) {
  RNSStackScreenActivityModeDetached = 0,
  RNSStackScreenActivityModeAttached = 1,
};

@interface RNSStackScreenComponentView : RNSReactBaseView

@property (nonatomic, weak, readwrite, nullable) RNSStackHostComponentView *stackHost;
@property (nonatomic, strong, readonly, nonnull) RNSStackScreenController *controller;
@property (nonatomic) BOOL isNativelyDismissed;

@end

#pragma mark - Props

@interface RNSStackScreenComponentView ()

@property (nonatomic, strong, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly) RNSStackScreenActivityMode activityMode;

@end

#pragma mark - Events

@interface RNSStackScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSStackScreenComponentEventEmitter *)reactEventEmitter;

@end

#pragma mark - Content scroll view

@interface RNSStackScreenComponentView ()

/**
 * Content scroll view registered by a descendant `RNSScrollViewMarkerComponentView`, or nil if
 * none has been registered. Queried by the owning controller (`RNSContainerItem`).
 */
- (nullable UIScrollView *)cachedContentScrollView;

@end

NS_ASSUME_NONNULL_END
