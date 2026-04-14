#pragma once

#import "RNSBaseScreenComponentView.h"
#import "RNSEnums.h"
#import "RNSSafeAreaProviding.h"
#import "RNSSplitHeaderConfigComponentView.h"
#import "RNSSplitScreenComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitNavigatorComponentView;
@class RNSSplitScreenController;

/**
 * @class RNSSplitScreenComponentView
 * @brief Native view component representing one screen in a RNSSplitNavigatorController stack.
 *
 * Responsible for lifecycle management, layout, and event emission for a single screen;
 * used as a child of RNSSplitNavigatorComponentView.
 */
@interface RNSSplitScreenComponentView : RNSBaseScreenComponentView <RNSSafeAreaProviding>

@property (nonatomic, strong, readonly, nonnull) RNSSplitScreenController *controller;
@property (nonatomic, weak, readwrite, nullable) RNSSplitNavigatorComponentView *splitNavigator;

- (nullable RNSSplitHeaderConfigComponentView *)findHeaderConfig;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitScreenComponentView ()

/**
 * @brief Determines whether this screen is part of the active navigation stack.
 */
@property (nonatomic, readonly) RNSSplitScreenActivityMode activityMode;

// screenKey is inherited from RNSBaseScreenComponentView

/**
 * @brief Whether native back-gesture dismiss is suppressed for this screen.
 */
@property (nonatomic, readonly) BOOL preventNativeDismiss;

@end

#pragma mark - Events

/**
 * @category Events
 * @brief APIs related to event emission to React Native.
 */
@interface RNSSplitScreenComponentView ()

/**
 * @brief Getter for the component's event emitter used for emitting events to React.
 *
 * @return A pointer to RNSSplitScreenComponentEventEmitter instance.
 */
- (nonnull RNSSplitScreenComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
