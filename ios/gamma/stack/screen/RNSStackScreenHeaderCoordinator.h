#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderConfigDataProviding.h"
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackScreenHeaderCoordinator : NSObject

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller;

@property (nonatomic, weak, nullable) id<RNSStackHeaderConfigDataProviding> configDataProvider;
@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> frameChangeDelegate;
@property (nonatomic, weak, nullable) id<RNSStackHeaderEventsDelegate> eventsDelegate;

- (void)rebuild;

- (void)applyConfigProperties;

- (void)rebuildItemWithId:(nullable NSString *)itemId;

- (void)reapplyMenuForItemWithId:(nullable NSString *)itemId;

- (void)resetTrackerForItemWithId:(nullable NSString *)itemId;

- (void)clearHeaderConfiguration;

@end

NS_ASSUME_NONNULL_END
