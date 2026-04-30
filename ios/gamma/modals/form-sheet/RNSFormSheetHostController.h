#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetHostController;

@protocol RNSFormSheetControllerDelegate <NSObject>
- (void)sheetControllerDidDismiss:(RNSFormSheetHostController *)controller;
- (void)sheetControllerDidLayoutWithBounds:(CGRect)bounds;
@end

@interface RNSFormSheetHostController : UIViewController

@property (nonatomic, weak, nullable) id<RNSFormSheetControllerDelegate> delegate;

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index;
- (void)removeReactSubview:(UIView *)subview;

@end

NS_ASSUME_NONNULL_END
