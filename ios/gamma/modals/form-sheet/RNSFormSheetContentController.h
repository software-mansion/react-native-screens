#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetContentView;
@class RNSFormSheetContentController;

@protocol RNSFormSheetHostControllerDelegate <NSObject>
- (void)sheetControllerDidNativeDismiss:(RNSFormSheetContentController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller;
@end

@interface RNSFormSheetContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetHostControllerDelegate> delegate;

@property (nonatomic, readonly, nonnull) RNSFormSheetContentView *contentView;

- (void)prepareForPresentation;

@end

NS_ASSUME_NONNULL_END
