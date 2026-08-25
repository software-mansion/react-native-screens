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

@end

NS_ASSUME_NONNULL_END
