#import "RNSStackAnimationCustomMotionConfig.h"

@implementation RNSStackAnimationCustomMotionConfig

- (instancetype)initWithTranslateX:(nullable RNSStackAnimationTranslateTrackConfig *)translateX
                        translateY:(nullable RNSStackAnimationTranslateTrackConfig *)translateY
                           opacity:(nullable RNSStackAnimationScalarTrackConfig *)opacity
                             scale:(nullable RNSStackAnimationScalarTrackConfig *)scale
                            scaleX:(nullable RNSStackAnimationScalarTrackConfig *)scaleX
                            scaleY:(nullable RNSStackAnimationScalarTrackConfig *)scaleY
                            rotate:(nullable RNSStackAnimationScalarTrackConfig *)rotate
                               dim:(nullable RNSStackAnimationDimTrackConfig *)dim
{
  if (self = [super init]) {
    _translateX = translateX;
    _translateY = translateY;
    _opacity = opacity;
    _scale = scale;
    _scaleX = scaleX;
    _scaleY = scaleY;
    _rotate = rotate;
    _dim = dim;
  }
  return self;
}

@end
