#pragma once

#import <UIKit/UIKit.h>
#import "RNSFormSheetContentWrapperDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSFormSheetContentView : UIView

@property (nonatomic, weak, nullable) id<RNSFormSheetContentWrapperDelegate> contentWrapperDelegate;

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index;
- (void)removeReactSubview:(UIView *)subview;

@end

NS_ASSUME_NONNULL_END
