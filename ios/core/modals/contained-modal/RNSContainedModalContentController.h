#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainedModalPresentationStyle.h"
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
- (void)modalControllerViewWillAppear:(RNSContainedModalContentController *)controller;
- (void)modalControllerViewDidAppear:(RNSContainedModalContentController *)controller;
- (void)modalControllerViewWillDisappear:(RNSContainedModalContentController *)controller;
- (void)modalControllerViewDidDisappear:(RNSContainedModalContentController *)controller;

/**
 * The request was dropped (not queued): no provider resolves for the modal,
 * the target provider is already presenting another modal, or an ancestor of
 * it is being dismissed. Only a new `isOpen` value retries.
 */
- (void)modalControllerDidRejectPresentation:(RNSContainedModalContentController *)controller;
@end

@interface RNSContainedModalContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSContainedModalContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) id<RNSContainedModalPresentationProvider> presentationProvider;

@property (nonatomic, readonly, nonnull) RNSContainedModalContentView *contentView;

/**
 * Over vs. replacing the provider's content. UIKit reads the resulting
 * `modalPresentationStyle` when the presentation starts, so a value set while
 * presented applies to the next presentation only. Defaults to over-content.
 */
@property (nonatomic) RNSContainedModalPresentationStyle presentationStyle;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;

#pragma mark - Updates

- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
