
#ifdef RCT_NEW_ARCH_ENABLED
#import <rnscreens/rnscreens.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSModule : RCTEventEmitter
#ifdef RCT_NEW_ARCH_ENABLED
                       <NativeScreensModuleSpec>
#else
                       <RCTBridgeModule>
#endif

@end

NS_ASSUME_NONNULL_END
