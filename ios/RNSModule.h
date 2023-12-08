
#ifdef RCT_NEW_ARCH_ENABLED
#import <rnscreens/rnscreens.h>
#else
#import <React/RCTBridge.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface RNSModule : NSObject
#ifdef RCT_NEW_ARCH_ENABLED
                       <NativeScreensModuleSpec>
#else
                       <RCTBridgeModule>
#endif

- (NSArray<NSNumber *> *)innerStartTransition:(NSNumber *)stackTag;
- (bool)innerUpdateTransition:(NSNumber *)stackTag progress:(double)progress;
- (bool)innerFinishTransition:(NSNumber *)stackTag canceled:(bool)canceled;

@end

NS_ASSUME_NONNULL_END
