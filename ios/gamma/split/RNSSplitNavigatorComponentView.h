#pragma once

#import "RNSBaseNavigatorComponentView.h"
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSSplitNavigatorShadowStateProxy.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitHostComponentView;
@class RNSSplitNavigatorController;
@class RNSSplitScreenComponentView;

/**
 * @class RNSSplitNavigatorComponentView
 * @brief Native view component representing one column navigator in a UISplitViewController layout.
 *
 * Acts as a UINavigationController container for a column's screen stack. It is responsible for
 * lifecycle management, layout, and event emission. Used as a child of RNSSplitHostComponentView.
 */
@interface RNSSplitNavigatorComponentView : RNSBaseNavigatorComponentView

@property (nonatomic, strong, readonly, nonnull) RNSSplitNavigatorController *controller;
@property (nonatomic, weak, readwrite, nullable) RNSSplitHostComponentView *splitHost;

- (nonnull NSMutableArray<RNSSplitScreenComponentView *> *)reactSubviews;

@end

#pragma mark - ShadowTreeState

/**
 * @category ShadowTreeState
 * @brief Interactions between the host component and the associated ShadowNode.
 */
@interface RNSSplitNavigatorComponentView ()

/**
 * @brief Getter for the proxy object that interfaces with the Shadow Tree state for this navigator.
 *
 * @return A pointer to a RNSSplitNavigatorShadowStateProxy instance.
 */
- (nonnull RNSSplitNavigatorShadowStateProxy *)shadowStateProxy;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitNavigatorComponentView ()

/**
 * @brief Determines which column of the UISplitViewController this navigator occupies.
 */
@property (nonatomic, readonly) RNSSplitNavigatorColumnType columnType;

@end

NS_ASSUME_NONNULL_END
