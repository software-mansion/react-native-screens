#import "RNSReactBaseView.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTViewManager.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RNSScrollViewWrapper :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

@end

#if !RCT_NEW_ARCH_ENABLED

@interface RNSScrollViewWrapperViewManager : RCTViewManager
@end

#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_END
