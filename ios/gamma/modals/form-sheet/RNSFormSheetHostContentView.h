#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetHostContentView : UIView

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index;
- (void)removeReactSubview:(UIView *)subview;

@end

NS_ASSUME_NONNULL_END
