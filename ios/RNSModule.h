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

- (nonnull NSArray<NSNumber *> *)_startTransition:(nonnull NSNumber *)stackTag;
- (bool)_updateTransition:(nonnull NSNumber *)stackTag progress:(double)progress;
- (bool)_finishTransition:(nonnull NSNumber *)stackTag canceled:(bool)canceled;

@end
