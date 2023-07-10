NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenModal : NSObject

+ (BOOL)isFullscreenModal:(UIModalPresentationStyle)presentationStyle;
+ (BOOL)isGrabbableModal:(UIModalPresentationStyle)presentationStyle;
+ (BOOL)isTransparentModal:(UIModalPresentationStyle)presentationStyle;

@end

NS_ASSUME_NONNULL_END
