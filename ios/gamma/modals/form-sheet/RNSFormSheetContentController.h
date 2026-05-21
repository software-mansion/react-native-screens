#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetContentView;
@class RNSFormSheetContentController;
@class RNSFormSheetHostComponentView;

// TODO: @t0maboro - now we should get rid of that delegate and handle ShadowStateProxy/TouchHandler origin sync from
// controller
@protocol RNSFormSheetContentControllerDelegate <NSObject>
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller;
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
