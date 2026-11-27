#pragma once

#import <UIKit/UIKit.h>
#import "RNSImageLoading.h"
#import "RNSStackHeaderConfigDataProviding.h"
#import "RNSStackHeaderEventsDelegate.h"
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

- (void)rebuild;

- (void)applyConfigProperties;

- (void)rebuildItemWithId:(nullable NSString *)itemId;

- (void)reapplyMenuForItemWithId:(nullable NSString *)itemId;

- (void)resetTrackerForItemWithId:(nullable NSString *)itemId;

- (void)reapplyTitleMenu;

- (void)resetTitleMenuTracker;

- (void)setToggleState:(BOOL)state
      forMenuElementId:(NSString *)elementId
         trackerItemId:(NSString *)trackerItemId
              rootMenu:(RNSStackHeaderMenuData *)rootMenu
            parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu;

- (void)clearHeaderConfiguration;

- (void)updateNavigationBarVisibilityAnimated:(BOOL)animated;

#if !TARGET_OS_TV
- (void)updateBackButtonMenuEnabled;

/**
 * Writes the back-button config of this screen onto `item`, the navigation item of the screen below it: UIKit
 * builds this screen's back button from that item. Without a header config the defaults are written.
 */
- (void)applyBackButtonConfigToNavigationItem:(UINavigationItem *)item;
#endif // !TARGET_OS_TV

@end

NS_ASSUME_NONNULL_END
