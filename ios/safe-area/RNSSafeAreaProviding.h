#import <UIKit/UIKit.h>

#define RNSSafeAreaDidChange @"RNSSafeAreaDidChange"

@protocol RNSSafeAreaProviding

- (UIEdgeInsets)RNS_safeAreaInsets;
- (void)invalidateSafeAreaInsets;

@end
