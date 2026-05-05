#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetContentView;
@class RNSFormSheetHostController;

@protocol RNSFormSheetHostControllerDelegate <NSObject>
- (void)sheetControllerDidNativeDismiss:(RNSFormSheetHostController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetHostController *)controller;
@end

@interface RNSFormSheetHostController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetHostControllerDelegate> delegate;

@property (nonatomic, readonly, nonnull) RNSFormSheetContentView *contentView;

@end

NS_ASSUME_NONNULL_END
