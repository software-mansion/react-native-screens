#pragma once

#import <UIKit/UIKit.h>

@protocol RNSReactLayoutDelegate <NSObject>

- (void)view:(UIView *)view receivedReactFrame:(CGRect)frame;

@end
