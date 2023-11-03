#import <React/RCTBridgeModule.h>

@interface RNSModule : NSObject <RCTBridgeModule>

- (nonnull NSArray<NSNumber *> *)_startTransition:(nonnull NSNumber *)stackTag;
- (bool)_updateTransition:(nonnull NSNumber *)stackTag progress:(double)progress;
- (bool)_finishTransition:(nonnull NSNumber *)stackTag canceled:(bool)canceled;

@end
