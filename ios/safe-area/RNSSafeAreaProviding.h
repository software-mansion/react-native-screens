#import <UIKit/UIKit.h>

@protocol RNSSafeAreaProviding

- (UIEdgeInsets)providerSafeAreaInsets;
- (void)invalidateSafeAreaInsets;

@end
