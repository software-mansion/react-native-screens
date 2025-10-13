// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)

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

#else

NS_ASSUME_NONNULL_BEGIN

@interface RNSReactBaseView : UIView
@end

NS_ASSUME_NONNULL_END

#endif // __cplusplus
