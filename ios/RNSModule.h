#pragma once

#if defined(__cplusplus)
#import <rnscreens/rnscreens.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNSModule : NSObject
#if defined(__cplusplus)
                       <NativeScreensModuleSpec>
#endif

@end

NS_ASSUME_NONNULL_END
