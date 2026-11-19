#pragma once

#import <UIKit/UIKit.h>
#import "RNSSheetPresentationStyle.h"
#import "RNSSheetProviders.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSheetContentView;
@class RNSSheetContentController;

@protocol RNSSheetContentControllerDelegate <NSObject>
- (void)sheetControllerDidDismiss:(RNSSheetContentController *)controller;
- (void)sheetControllerDidNativeDismiss:(RNSSheetContentController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSSheetContentController *)controller;
#if !TARGET_OS_TV
- (void)sheetController:(RNSSheetContentController *)controller
    didChangeDetentIdentifier:(nullable NSString *)identifier;
#endif // !TARGET_OS_TV
- (void)sheetControllerDidPreventNativeDismiss:(RNSSheetContentController *)controller;
// Lifecycle
- (void)sheetControllerWillAppear:(RNSSheetContentController *)controller;
- (void)sheetControllerDidAppear:(RNSSheetContentController *)controller;
- (void)sheetControllerWillDisappear:(RNSSheetContentController *)controller;
- (void)sheetControllerDidDisappear:(RNSSheetContentController *)controller;
@end

@interface RNSSheetContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSSheetContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) id<RNSSheetPresentationProvider> presentationProvider;
@property (nonatomic, weak, nullable) id<RNSSheetAppearanceProvider> appearanceProvider;
@property (nonatomic, weak, nullable) id<RNSSheetBehaviorProvider> behaviorProvider;

@property (nonatomic, readonly, nonnull) RNSSheetContentView *contentView;

/**
 * UIKit presentation style the controller presents with. Defaults to `RNSSheetPresentationStyleFormSheet`.
 *
 * Must be set only while the controller is dismissed: UIKit does not support changing `modalPresentationStyle` of
 * a presented controller.
 */
@property (nonatomic) RNSSheetPresentationStyle presentationStyle;

/**
 * Whether UIKit on the current platform can present with `presentationStyle`.
 */
- (BOOL)isPresentationStyleAvailable;

#pragma mark - Presentation

- (void)prepareForPresentation;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;
- (void)setNeedsBehaviorUpdate;
- (void)setNeedsAppearanceUpdate;
- (void)setNeedsInitialDetentUpdate;

#pragma mark - Updates

- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
