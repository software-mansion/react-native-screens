#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSplitViewScreenComponentEventEmitter.h"
#import "RNSSplitViewScreenShadowStateProxy.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewHostComponentView;
@class RNSSplitViewScreenController;

/**
 * @class RNSSplitViewScreenComponentView
 * @brief Native view component representing one column in a UISplitViewController layout.
 *
 * Responsible for a lifecycle management, layout, and event emission for a single screen; used as a child
 * of RNSSplitViewHostComponentView.
 */
@interface RNSSplitViewScreenComponentView : RNSReactBaseView

/**
 * @brief Getter for the internal RNSSplitViewScreenController that manages SplitView component.
 *
 * @return A non-null instance of RNSSplitViewScreenController.
 */
@property (nonatomic, strong, readonly, nonnull) RNSSplitViewScreenController *controller;

/**
 * @brief The parent SplitView associated with this screen.
 *
 * @return An instance of RNSSplitViewHostComponentView.
 */
@property (nonatomic, weak, readwrite, nullable) RNSSplitViewHostComponentView *splitViewHost;

@end

#pragma mark - ShadowTreeState

/**
 * @category ShadowTreeState
 * @brief Interactions between the host component and the associated ShadowNode.
 */
@interface RNSSplitViewScreenComponentView ()

/**
 * @brief Getter for the proxy object that interfaces with the Shadow Tree state for this screen.
 *
 * @return A pointer to a RNSSplitViewScreenShadowStateProxy instance.
 */
- (nonnull RNSSplitViewScreenShadowStateProxy *)shadowStateProxy;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitViewScreenComponentView ()

/**
 * @brief Determines the purpose for the column (classic Column or one of specific types, like Inspector)
 */
@property (nonatomic, readonly) RNSSplitViewScreenColumnType columnType;

@end

#pragma mark - Events

/**
 * @category Events
 * @brief APIs related to event emission to React Native.
 */
@interface RNSSplitViewScreenComponentView ()

/**
 * @brief Getter for the component's event emitter used for emitting events to React.
 *
 * @return A pointer to RNSSplitViewScreenComponentEventEmitter instance.
 */
- (nonnull RNSSplitViewScreenComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
