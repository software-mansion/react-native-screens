#pragma once

#import <UIKit/UIKit.h>
#import "RNSFullScreenModalPresentationStyle.h"
#import "RNSFullScreenModalProviders.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSFullScreenModalContentView;
@class RNSFullScreenModalContentController;

@protocol RNSFullScreenModalContentControllerDelegate <NSObject>
- (void)modalControllerViewDidLayoutSubviews:(RNSFullScreenModalContentController *)controller;

- (void)modalControllerViewWillAppear:(RNSFullScreenModalContentController *)controller;
- (void)modalControllerViewDidAppear:(RNSFullScreenModalContentController *)controller;
- (void)modalControllerViewWillDisappear:(RNSFullScreenModalContentController *)controller;
- (void)modalControllerViewDidDisappear:(RNSFullScreenModalContentController *)controller;

/// The programmatic dismissal requested by `isOpen == NO` has completed.
- (void)modalControllerDidDismiss:(RNSFullScreenModalContentController *)controller;

/**
 * The modal left the presentation hierarchy while `isOpen` was still `YES`,
 * e.g. UIKit took it down together with a controller below it.
 */
- (void)modalControllerDidNativeDismiss:(RNSFullScreenModalContentController *)controller;

/**
 * The request was dropped (not queued): the top-most controller contains the
 * modal's host and is being dismissed. Only a new `isOpen` value retries.
 */
- (void)modalControllerDidRejectPresentation:(RNSFullScreenModalContentController *)controller;
@end

@interface RNSFullScreenModalContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFullScreenModalContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) id<RNSFullScreenModalPresentationProvider> presentationProvider;

@property (nonatomic, readonly, nonnull) RNSFullScreenModalContentView *contentView;

/**
 * Must be set only while the controller is dismissed: UIKit does not support
 * changing `modalPresentationStyle` of a presented controller.
 */
@property (nonatomic) RNSFullScreenModalPresentationStyle presentationStyle;

/**
 * Background of the content view. `nil` selects the style's default: the
 * system background for `ReplacingContent`, clear for `OverContent`.
 */
@property (nonatomic, nullable) UIColor *nativeContainerBackgroundColor;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;

#pragma mark - Updates

- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
