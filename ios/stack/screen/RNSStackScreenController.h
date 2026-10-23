#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainerItem.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackController;
@class RNSStackScreenController;
@class RNSStackScreenHeaderCoordinator;

/**
 * Receives the lifecycle of a stack screen from its controller.
 */
@protocol RNSStackScreenControllerDelegate <NSObject>

- (void)stackScreenControllerWillAppear:(RNSStackScreenController *)controller;
- (void)stackScreenControllerDidAppear:(RNSStackScreenController *)controller;
- (void)stackScreenControllerWillDisappear:(RNSStackScreenController *)controller;
- (void)stackScreenControllerDidDisappear:(RNSStackScreenController *)controller;

/**
 * Called when the controller has been removed from its navigation controller, after the pop transition completed.
 * The removal may have been requested by the owner of the screen or made by UIKit (e.g. the back gesture); the
 * delegate tells them apart.
 */
- (void)stackScreenControllerDidLeaveStack:(RNSStackScreenController *)controller;

@end

/**
 * Provides the stack screen data its controller needs.
 */
@protocol RNSStackScreenControllerDataProvider <NSObject>

/**
 * Content scroll view registered within the screen, or nil if none has been registered.
 */
- (nullable UIScrollView *)cachedContentScrollView;

@end

@interface RNSStackScreenController : UIViewController <RNSContainerItem>

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenHeaderCoordinator *headerCoordinator;

@property (nonatomic, weak, nullable) id<RNSStackScreenControllerDelegate> delegate;
@property (nonatomic, weak, nullable) id<RNSStackScreenControllerDataProvider> dataProvider;

@end

NS_ASSUME_NONNULL_END
