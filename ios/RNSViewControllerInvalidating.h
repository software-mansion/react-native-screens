#import <cxxreact/ReactNativeVersion.h>

#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82

#include <react/renderer/mounting/ShadowViewMutation.h>

@protocol RNSViewControllerInvalidating

- (void)invalidateController;

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation;

@end

#endif // RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82
