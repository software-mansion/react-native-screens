// Hide C++ symbols from C compiler used when building Swift module
#pragma mark - New architecture definitions
#if RCT_NEW_ARCH_ENABLED

#import <React/RCTViewComponentView.h>

@interface RNSReactBaseView : RCTViewComponentView
@end

#else
#pragma mark - Legacy architecture definitions

#import <React/RCTView.h>

@interface RNSReactBaseView : RCTView
@end

#endif // RCT_NEW_ARCH_ENABLED
