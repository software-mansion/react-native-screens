#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSModalFormSheetController;

@protocol RNSModalFormSheetControllerDelegate <NSObject>
- (void)sheetControllerDidDismiss:(RNSModalFormSheetController *)controller;
@end

@interface RNSModalFormSheetController : UIViewController

@property (nonatomic, weak) id<RNSModalFormSheetControllerDelegate> delegate;

- (void)updateContentSubviews:(NSArray<UIView *> *)subviews;

@end

NS_ASSUME_NONNULL_END
