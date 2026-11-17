#pragma once

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus)

#import <React/RCTViewComponentView.h>

@interface RNSReactBaseView : RCTViewComponentView
@end

#else

NS_ASSUME_NONNULL_BEGIN

@interface RNSReactBaseView : UIView
@end

NS_ASSUME_NONNULL_END

#endif // __cplusplus
