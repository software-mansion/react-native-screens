#import "RNSScreen.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreen (RNSScreenHeaderHeight)

- (BOOL)isFullscreenModal;
- (BOOL)isTransparentModal;

- (CGFloat)getCalculatedHeaderHeight:(BOOL)isModal;
- (void)recalculateHeaderHeightIsModal:(BOOL)isModal;

@end

NS_ASSUME_NONNULL_END
