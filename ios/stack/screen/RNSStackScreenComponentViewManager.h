#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)
@interface RNSStackScreenComponentViewManager : RCTViewManager
#else
@interface RNSStackScreenComponentViewManager : NSObject
#endif

@end

NS_ASSUME_NONNULL_END
