#pragma once

#import <UIKit/UIKit.h>

#import "RNSImageLoading.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderMenuData.h"
#import "RNSStackHeaderMenuToggleStateTracker.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuCoordinator : NSObject

/**
 * Applies menu specification to the item. Sets up event delegate to receive
 * menu updates when user selects options or clicks actions. Since menu needs
 * to be rebuilt after user changes selection or after async icon load,
 * the `menuInvalidatedCallback` is triggered and the caller is expected
 * to reapply the menu there.
 */
+ (void)applyMenu:(RNSStackHeaderMenuData *)data
             toBarButtonItem:(UIBarButtonItem *)item
    withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
             withImageLoader:(id<RNSImageLoading>)imageLoader
     menuInvalidatedCallback:(nullable void (^)(void))onMenuInvalidated;

/**
 * Collects IDs of all toggle items in a single selection hierarchy rooted at the given menu.
 */
+ (NSArray<NSString *> *)getAllToggleItemsIdsInSingleSelectionHierarchy:(RNSStackHeaderMenuData *)menu;

/**
 * Collects IDs of toggle items that are direct children of the given menu.
 */
+ (NSArray<NSString *> *)getToggleItemsIdsInMenu:(RNSStackHeaderMenuData *)menu;

/**
 * Builds a UIMenu from the given menu data. Used for `UINavigationItem.titleMenuProvider`.
 */
+ (UIMenu *)buildUIMenuFromData:(RNSStackHeaderMenuData *)data
       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                   stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
                withImageLoader:(id<RNSImageLoading>)imageLoader
        menuInvalidatedCallback:(nullable void (^)(void))onMenuInvalidated;

/**
 * Constructs a new menu tree with the child matching `elementId` replaced by `newElement`.
 * Returns the original menu unchanged if no matching child is found in the subtree.
 */
+ (RNSStackHeaderMenuData *)menu:(RNSStackHeaderMenuData *)menu
            replacingChildWithId:(NSString *)elementId
                     withElement:(id<RNSStackHeaderMenuElement>)newElement;

@end

NS_ASSUME_NONNULL_END
