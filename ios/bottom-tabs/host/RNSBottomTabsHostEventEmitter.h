#import <Foundation/Foundation.h>

// Hide C++ symbols from C compiler used when building Swift module
#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/EventEmitters.h>

namespace react = facebook::react;
#endif // __cplusplus

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTComponent.h>
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)
struct OnNativeFocusChangePayload {
  NSString *_Nonnull tabKey;
};
#else
typedef struct {
  NSString *_Nonnull tabKey;
} OnNativeFocusChangePayload;
#endif

@interface RNSBottomTabsHostEventEmitter : NSObject

- (BOOL)emitOnNativeFocusChange:(OnNativeFocusChangePayload)payload;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSBottomTabsHostEventEmitter ()

#if RCT_NEW_ARCH_ENABLED

- (void)updateEventEmitter:(const std::shared_ptr<const react::RNSBottomTabsEventEmitter> &)emitter;

#else
#pragma mark - LEGACY Event emitter blocks

@property (nonatomic, copy) RCTDirectEventBlock onNativeFocusChange;

#endif // RCT_NEW_ARCH_ENABLED

@end

#endif // __cplusplus

NS_ASSUME_NONNULL_END
