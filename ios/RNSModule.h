#pragma once

#ifdef __cplusplus
#import <rnscreens/rnscreens.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNSModule : NSObject
#ifdef __cplusplus
                       <NativeScreensModuleSpec>
#endif

@end

NS_ASSUME_NONNULL_END
