@protocol RNSSharedElementTransitionsDelegate <NSObject>

- (void)onScreenTransitionCreate:(id)screen;
- (void)onNativeAnimationEnd:(UIView *)screeen;

@end

@interface RNSSharedElementAnimator : NSObject

+ (void)setDelegate:(NSObject<RNSSharedElementTransitionsDelegate> *)delegate;
+ (NSObject<RNSSharedElementTransitionsDelegate> *)getDelegate;

@end
