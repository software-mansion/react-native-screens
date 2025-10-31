#ifdef RCT_NEW_ARCH_ENABLED

#include <react/renderer/mounting/ShadowViewMutation.h>

@protocol RNSViewControllerInvalidating

- (void)invalidateController;

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation;

@end

#endif // RCT_NEW_ARCH_ENABLED
