#import <UIKit/UIKit.h>

@protocol RNSSafeAreaProviding

- (UIEdgeInsets)RNS_safeAreaInsets;
- (void)invalidateSafeAreaInsets;

@end
