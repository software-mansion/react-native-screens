#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetContentView : UIView

- (void)insertContentSubview:(UIView *)subview atIndex:(NSInteger)index;
- (void)removeContentSubview:(UIView *)subview;

@end

NS_ASSUME_NONNULL_END
