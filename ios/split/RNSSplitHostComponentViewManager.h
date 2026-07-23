#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)
@interface RNSSplitHostComponentViewManager : RCTViewManager
#else
@interface RNSSplitHostComponentViewManager : NSObject
#endif // __cplusplus

@end

NS_ASSUME_NONNULL_END
