@interface RNSSharedElementAnimator : NSObject

+ (float)interpolateWithFrom:(double)from to:(double)to progress:(double)progress;
+ (NSMutableArray<NSArray *> *)prepareSharedElementsArrayForVC:(UIViewController *)vc closing:(BOOL)closing;
+ (void)copyValuesFromView:(UIView *)view toSnapshot:(UIView *)snapshot;
+ (void)calculateFramesOfSharedElementsWithProgress:(double)progress
                                          container:(UIView *)container
                                     sharedElements:(NSMutableArray<NSArray *> *)sharedElements
                                             toView:(UIView *)toView;

@end
