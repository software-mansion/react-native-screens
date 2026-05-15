#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetContentView;
@class RNSFormSheetContentController;

@protocol RNSFormSheetContentControllerDelegate <NSObject>
- (void)sheetControllerDidNativeDismiss:(RNSFormSheetContentController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetContentController *)controller;
@end

@interface RNSFormSheetContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetContentControllerDelegate> delegate;

@property (nonatomic, readonly, nonnull) RNSFormSheetContentView *contentView;

- (void)presentFromWindow:(nullable UIWindow *)window;
- (void)dismiss;

@end

NS_ASSUME_NONNULL_END
