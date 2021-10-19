@protocol RNSSEA <NSObject>

- (void)reanimatedMockTransitionWithConverterView:(UIView *)converter
                                           fromID:(NSNumber *)fromID
                                             toID:(NSNumber *)toID
                                          rootTag:(NSNumber *)rootTag;

@end

@interface RNSSharedElementAnimator : NSObject

+ (void)setDelegate:(NSObject<RNSSEA> *)delegate;
+ (float)interpolateWithFrom:(double)from to:(double)to progress:(double)progress;
+ (NSMutableArray<NSArray *> *)prepareSharedElementsArrayForVC:(UIViewController *)vc closing:(BOOL)closing;
+ (void)copyValuesFromView:(UIView *)view toSnapshot:(UIView *)snapshot;
+ (void)calculateFramesOfSharedElementsWithProgress:(double)progress
                                          container:(UIView *)container
                                     sharedElements:(NSMutableArray<NSArray *> *)sharedElements
                                             toView:(UIView *)toView;
+ (void)reanimatedMockTransitionWithConverterView:(UIView *)converter
                                           fromID:(NSNumber *)fromID
                                             toID:(NSNumber *)toID
                                          rootTag:(NSNumber *)rootTag;
@end
