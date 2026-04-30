#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetHostController;

@protocol RNSFormSheetHostControllerDelegate <NSObject>
- (void)sheetControllerDidNativeDismiss:(RNSFormSheetHostController *)controller;
- (void)sheetControllerViewDidLayoutSubviews:(RNSFormSheetHostController *)controller;
@end

@interface RNSFormSheetHostController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetHostControllerDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
