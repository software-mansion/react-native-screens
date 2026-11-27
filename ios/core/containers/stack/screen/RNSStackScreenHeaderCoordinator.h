#pragma once

#import <UIKit/UIKit.h>
#import "RNSImageLoading.h"
#import "RNSStackHeaderConfigDataProviding.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderMenuData.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackScreenHeaderCoordinator : NSObject

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller;

@property (nonatomic, weak, nullable) id<RNSStackHeaderConfigDataProviding> configDataProvider;
@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> frameChangeDelegate;
@property (nonatomic, weak, nullable) id<RNSStackHeaderEventsDelegate> eventsDelegate;
@property (nonatomic, weak, nullable) id<RNSImageLoading> imageLoader;

/**
 * Whether the navigation bar is shown while the screen has no header configuration. Defaults to NO: a screen without
 * a header configuration hides the navigation bar.
 */
@property (nonatomic) BOOL showsNavigationBarWithoutHeaderConfig;

/**
 * Applies the whole header configuration: the config properties, the title menu and the items (see `updateItems`).
 */
- (void)applyHeaderConfiguration;

- (void)applyConfigProperties;

/**
 * Marks a child of the header config whose properties changed, so that the next `updateItems` applies them to its bar
 * button item. `child` is a header item or a header item spacer. Children that were added, removed or moved do not
 * have to be marked.
 */
- (void)setNeedsUpdateForChild:(id)child;

/**
 * Marks a header item whose `menu` or `menuRepresentation` changed, so that the next `updateItems` applies both to
 * its bar button item.
 */
- (void)setNeedsMenuUpdateForItem:(id<RNSStackHeaderItemDataProviding>)item;

/**
 * Brings the navigation item in line with the children of the header config. A child keeps its bar button item (and
 * the view wrapping its custom view) for as long as it stays a child, also when it is moved. Bar button items are
 * created for new children, and for a marked child when a property changed that UIKit does not apply to an item that
 * is already in the navigation bar. Other properties of the marked children are changed in place. Does nothing when
 * the navigation item is already up to date.
 */
- (void)updateItems;

/**
 * Applies the menu and the menu representation of `item` to its bar button item right away.
 */
- (void)reapplyMenuForItem:(nullable id<RNSStackHeaderItemDataProviding>)item;

- (void)reapplyTitleMenu;

- (void)resetTitleMenuTracker;

/**
 * Sets the toggle state of an element of the menu or the menu representation of `headerItem`.
 */
- (void)setToggleState:(BOOL)state
      forMenuElementId:(NSString *)elementId
          inHeaderItem:(id<RNSStackHeaderItemDataProviding>)headerItem
              rootMenu:(RNSStackHeaderMenuData *)rootMenu
            parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu;

/**
 * Sets the toggle state of an element of the title menu.
 */
- (void)setTitleMenuToggleState:(BOOL)state
               forMenuElementId:(NSString *)elementId
                       rootMenu:(RNSStackHeaderMenuData *)rootMenu
                     parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu;

- (void)clearHeaderConfiguration;

- (void)updateNavigationBarVisibilityAnimated:(BOOL)animated;

#if !TARGET_OS_TV
- (void)updateBackButtonMenuEnabled;

- (void)clearAppliedBackButtonConfig;
#endif // !TARGET_OS_TV

@end

NS_ASSUME_NONNULL_END
