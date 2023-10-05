#ifdef RCT_NEW_ARCH_ENABLED
#import <rnscreens/rnscreens.h>
#else
#import <React/RCTBridge.h>
#endif

@interface RNSModule : NSObject
#ifdef RCT_NEW_ARCH_ENABLED
                       <NativeScreensModuleSpec>
#else
                       <RCTBridgeModule>
#endif
@end
