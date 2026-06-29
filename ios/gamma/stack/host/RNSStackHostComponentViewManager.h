#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)
@interface RNSStackHostComponentViewManager : RCTViewManager
#else
@interface RNSStackHostComponentViewManager : NSObject
#endif

@end

NS_ASSUME_NONNULL_END
