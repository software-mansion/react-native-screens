#pragma once

#import <Foundation/Foundation.h>
#import "RNSSplitAppearanceCoordinator.h"
#import "RNSSplitHostProviders.h"

@class RNSSplitHostController;

NS_ASSUME_NONNULL_BEGIN

/**
 * @brief - Class responsible for applying all upcoming updates to SplitView.
 *
 * This class is synchronizing UISplitViewController configuration props which are affecting the SplitView appearance
 * with the configuration exposed by the appearance provider.
 */
@interface RNSSplitAppearanceApplicator : NSObject

/**
 * @brief Function responsible for applying all updates to SplitView in correct order
 *
 * It requests calling proper callbacks with batched SplitView updates on the AppearanceCoordinator object
 *
 * @param provider The provider of the appearance configuration.
 * @param splitHostController The controller associated with the SplitView component which receives updates and
 * manages the native layer.
 * @param appearanceCoordinator The coordinator which is checking whether the update needs to be applied and if so, it
 * executes the callback passed by this class.
 */
- (void)updateAppearanceIfNeeded:(id<RNSSplitHostAppearanceProvider>)provider
             splitHostController:(RNSSplitHostController *)splitHostController
           appearanceCoordinator:(RNSSplitAppearanceCoordinator *)appearanceCoordinator;

@end

NS_ASSUME_NONNULL_END
