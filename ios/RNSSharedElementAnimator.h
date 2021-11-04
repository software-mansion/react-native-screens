@protocol RNSSharedElementTransitionsDelegate <NSObject>

- (void)reanimatedMockTransitionWithConverterView:(UIView *)converter
                                         fromView:(UIView *)fromView
                                fromViewConverter:(UIView *)startingViewConverter
                                           toView:(UIView *)toView
                                  toViewConverter:(UIView *)toViewConverter;

@end

@interface RNSSharedElementAnimator : NSObject

+ (void)setDelegate:(NSObject<RNSSharedElementTransitionsDelegate> *)delegate;
+ (NSObject<RNSSharedElementTransitionsDelegate> *)getDelegate;
+ (NSMutableArray<NSArray *> *)prepareSharedElementsArrayForVC:(UIViewController *)vc;

@end
