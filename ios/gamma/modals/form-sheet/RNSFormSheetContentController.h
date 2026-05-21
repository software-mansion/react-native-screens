#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetContentView;
@class RNSFormSheetContentController;
@class RNSFormSheetHostComponentView;

@protocol RNSFormSheetContentControllerDelegate <NSObject>
- (void)sheetControllerDidNativeDismiss:(RNSFormSheetContentController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller;
#if !TARGET_OS_TV
- (void)sheetController:(RNSFormSheetContentController *)controller
    didChangeDetentIdentifier:(nullable NSString *)identifier;
#endif // !TARGET_OS_TV
@end

@interface RNSFormSheetContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) RNSFormSheetHostComponentView *hostComponentView;

@property (nonatomic, readonly, nonnull) RNSFormSheetContentView *contentView;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;
- (void)setNeedsAppearanceUpdate;
- (void)setNeedsInitialDetentReset;

#pragma mark - Mounting transaction signals

- (void)reactMountingTransactionWillMount;
- (void)reactMountingTransactionDidMount;

@end

NS_ASSUME_NONNULL_END
