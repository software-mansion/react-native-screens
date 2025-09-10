#import <UIKit/UIKit.h>

NSString *const RNSSafeAreaDidChange = @"RNSSafeAreaDidChange";

@protocol RNSSafeAreaProviding

- (UIEdgeInsets)RNS_safeAreaInsets;
- (void)invalidateSafeAreaInsets;

@end
