#import <cxxreact/ReactNativeVersion.h>

#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82

#import <UIKit/UIKit.h>
#import "RNSViewControllerInvalidating.h"

@interface RNSInvalidatedComponentsRegistry : NSObject

- (void)pushForInvalidation:(UIView<RNSViewControllerInvalidating> *)view;
- (void)flushInvalidViews;

@end

#endif // RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82
