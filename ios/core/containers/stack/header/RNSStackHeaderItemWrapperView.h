#pragma once

#import <UIKit/UIKit.h>
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemWrapperView : UIView

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> delegate;

- (instancetype)initWithDelegate:(nullable id<RNSViewFrameChangeDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END
