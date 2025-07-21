#import <Foundation/Foundation.h>

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewScreenComponentView;

@interface RNSSplitViewScreenShadowStateProxy : NSObject

- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView;

- (void)updateShadowStateOfComponent:(RNSSplitViewScreenComponentView *)screenComponentView
             inContextOfAncestorView:(UIView *_Nullable)ancestorView;

- (void)updateShadowStateWithFrame:(CGRect)frame;

@end

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSSplitViewScreenShadowStateProxy ()

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState;

@end

#endif // __cplusplus
NS_ASSUME_NONNULL_END
