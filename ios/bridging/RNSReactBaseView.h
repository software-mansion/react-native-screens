// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)

#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSReactBaseView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#else

NS_ASSUME_NONNULL_BEGIN

@interface RNSReactBaseView : UIView
@end

NS_ASSUME_NONNULL_END

#endif // __cplusplus
