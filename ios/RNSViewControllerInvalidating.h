#if RCT_NEW_ARCH_ENABLED
#include <react/renderer/mounting/ShadowViewMutation.h>
#endif // RCT_NEW_ARCH_ENABLED

@protocol RNSViewControllerInvalidating

- (void)invalidateController;

#if RCT_NEW_ARCH_ENABLED
- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation;
#endif // RCT_NEW_ARCH_ENABLED

@end
