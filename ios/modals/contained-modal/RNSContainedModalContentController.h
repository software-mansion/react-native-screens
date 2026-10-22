#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainedModalProviders.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSContainedModalContentView;
@class RNSContainedModalContentController;

@protocol RNSContainedModalContentControllerDelegate <NSObject>
- (void)modalControllerViewDidLayoutSubviews:(RNSContainedModalContentController *)controller;

/**
 * Fires on the initial presentation AND on a UIKit-driven restore after a
 * suspension (e.g. the covering stack screen was popped). A restore
 * re-attaches without a layout pass, so appearance - not layout - is the
 * signal to rebuild state after a disappearance.
 */
- (void)modalControllerViewDidAppear:(RNSContainedModalContentController *)controller;
- (void)modalControllerViewDidDisappear:(RNSContainedModalContentController *)controller;

/**
 * The request was dropped (not queued): the target provider is already
 * presenting another modal, or an ancestor of it is being dismissed.
 */
- (void)modalControllerDidRejectPresentation:(RNSContainedModalContentController *)controller;
@end

@interface RNSContainedModalContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSContainedModalContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) id<RNSContainedModalPresentationProvider> presentationProvider;

@property (nonatomic, readonly, nonnull) RNSContainedModalContentView *contentView;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;

#pragma mark - Updates

- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
