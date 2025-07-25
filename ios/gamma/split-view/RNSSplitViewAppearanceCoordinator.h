#import "RNSSplitViewHostComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewAppearanceUpdater;

/**
 * @class RNSSplitViewAppearanceCoordinator
 * @brief Responsible for batching updates for appearance & applying them in appropriate order.
 *
 * It synchronizes React properties with UISplitViewController instance.
 */
@interface RNSSplitViewAppearanceCoordinator : NSObject

/**
 * @brief Updates the appearance of the given SplitView controller.
 *
 * This method transfers values from the RNSSplitViewHostComponentView to the RNSSplitViewHostController (which is an
 * extension for UISplitViewController).
 *
 * @param splitView The split view component view associated with the native component, containing updated properties.
 * @param splitViewController The native controller responsible for rendering the split view and applying visual
 * changes.
 */
- (void)updateAppearanceIfNeededOfSplitView:(RNSSplitViewHostComponentView *_Nonnull)splitView
                             withController:(RNSSplitViewHostController *_Nonnull)splitViewController;

@end

NS_ASSUME_NONNULL_END
