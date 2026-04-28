#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSFormSheetController;

@protocol RNSFormSheetControllerDelegate <NSObject>
- (void)sheetControllerDidDismiss:(RNSFormSheetController *)controller;
- (void)sheetControllerDidLayoutWithBounds:(CGRect)bounds;
@end

@interface RNSFormSheetController : UIViewController

@property (nonatomic, weak) id<RNSFormSheetControllerDelegate> delegate;

- (void)updateContentSubviews:(NSArray<UIView *> *)subviews;

@end

NS_ASSUME_NONNULL_END
