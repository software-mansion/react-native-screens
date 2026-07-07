#pragma once

#import <UIKit/UIKit.h>
#import "RNSFormSheetProviders.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetContentView;
@class RNSFormSheetContentController;

@protocol RNSFormSheetContentControllerDelegate <NSObject>
- (void)sheetControllerDidDismiss:(RNSFormSheetContentController *)controller;
- (void)sheetControllerDidNativeDismiss:(RNSFormSheetContentController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller;
#if !TARGET_OS_TV
- (void)sheetController:(RNSFormSheetContentController *)controller
    didChangeDetentIdentifier:(nullable NSString *)identifier;
#endif // !TARGET_OS_TV
- (void)sheetControllerDidPreventNativeDismiss:(RNSFormSheetContentController *)controller;
// Lifecycle
- (void)sheetControllerWillAppear:(RNSFormSheetContentController *)controller;
- (void)sheetControllerDidAppear:(RNSFormSheetContentController *)controller;
- (void)sheetControllerWillDisappear:(RNSFormSheetContentController *)controller;
- (void)sheetControllerDidDisappear:(RNSFormSheetContentController *)controller;
@end

@interface RNSFormSheetContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) id<RNSFormSheetPresentationProvider> presentationProvider;
@property (nonatomic, weak, nullable) id<RNSFormSheetAppearanceProvider> appearanceProvider;
@property (nonatomic, weak, nullable) id<RNSFormSheetBehaviorProvider> behaviorProvider;

@property (nonatomic, readonly, nonnull) RNSFormSheetContentView *contentView;

#pragma mark - Presentation

- (void)prepareForPresentation;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;
- (void)setNeedsBehaviorUpdate;
- (void)setNeedsAppearanceUpdate;
- (void)setNeedsInitialDetentReset;

#pragma mark - Updates

- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
