#pragma once

#import "RNSEnums.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitHostComponentView;
@class RNSSplitScreenController;
@class RNSStackNavigationController;

/**
 * @class RNSSplitScreenComponentView
 * @brief Native view component representing one column in a UISplitViewController layout.
 *
 * Responsible for a lifecycle management, layout, and event emission for a single screen; used as a child
 * of RNSSplitHostComponentView.
 */
@interface RNSSplitScreenComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nonnull) RNSSplitScreenController *controller;
@property (nonatomic, weak, readwrite, nullable) RNSSplitHostComponentView *splitHost;

/**
 * @brief The navigation controller the Split installs for the column.
 *
 * A column whose only child is a Stack.Host in headless mode provides the navigation controller of that host. Any
 * other column provides the one its controller creates.
 */
@property (nonatomic, readonly) RNSStackNavigationController *columnNavigationController;

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

NS_ASSUME_NONNULL_END
