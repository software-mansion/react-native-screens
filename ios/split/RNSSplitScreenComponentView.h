#pragma once

#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"
#import "RNSSplitScreenComponentEventEmitter.h"
#import "RNSSplitScreenShadowStateProxy.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitHostComponentView;
@class RNSSplitScreenController;

/**
 * @class RNSSplitScreenComponentView
 * @brief Native view component representing one column in a UISplitViewController layout.
 *
 * Responsible for a lifecycle management, layout, and event emission for a single screen; used as a child
 * of RNSSplitHostComponentView.
 */
@interface RNSSplitScreenComponentView : RNSReactBaseView <RNSSafeAreaProviding>

@property (nonatomic, strong, readonly, nonnull) RNSSplitScreenController *controller;
@property (nonatomic, weak, readwrite, nullable) RNSSplitHostComponentView *splitHost;

@end

#pragma mark - ShadowTreeState

/**
 * @category ShadowTreeState
 * @brief Interactions between the host component and the associated ShadowNode.
 */
@interface RNSSplitScreenComponentView ()

/**
 * @brief Getter for the proxy object that interfaces with the Shadow Tree state for this screen.
 *
 * The ShadowStateProxy is the object that's responsible for sending layout updates coming from the Host tree to the
 * ShadowTree.
 *
 * @return A pointer to a RNSSplitScreenShadowStateProxy instance.
 */
- (nonnull RNSSplitScreenShadowStateProxy *)shadowStateProxy;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitScreenComponentView ()

/**
 * @brief Determines the purpose for the column (classic Column or one of specific types, like Inspector)
 */
@property (nonatomic, readonly) RNSSplitScreenColumnType columnType;

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
