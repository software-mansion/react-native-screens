#import "RNSStackAnimationTrack.h"

@implementation RNSStackAnimationTrack

- (instancetype)initWithTiming:(RNSStackAnimationTiming *)timing
{
  if (self = [super init]) {
    _timing = timing;
  }
  return self;
}

- (instancetype)withTiming:(RNSStackAnimationTiming *)timing
{
  return [[[self class] alloc] initWithTiming:timing];
}

@end

@implementation RNSStackAnimationTranslateTrack

- (instancetype)initWithAxis:(RNSStackAnimationAxis)axis
                        from:(RNSStackAnimationLength *)from
                          to:(RNSStackAnimationLength *)to
                      timing:(RNSStackAnimationTiming *)timing
{
  if (self = [super initWithTiming:timing]) {
    _axis = axis;
    _from = from;
    _to = to;
  }
  return self;
}

- (instancetype)withTiming:(RNSStackAnimationTiming *)timing
{
  return [[[self class] alloc] initWithAxis:_axis from:_from to:_to timing:timing];
}

@end

@implementation RNSStackAnimationPropertyTrack

- (instancetype)initWithViewProperty:(RNSStackAnimationViewProperty)viewProperty
                                from:(CGFloat)from
                                  to:(CGFloat)to
                              timing:(RNSStackAnimationTiming *)timing
{
  if (self = [super initWithTiming:timing]) {
    _viewProperty = viewProperty;
    _from = from;
    _to = to;
  }
  return self;
}

- (instancetype)withTiming:(RNSStackAnimationTiming *)timing
{
  return [[[self class] alloc] initWithViewProperty:_viewProperty from:_from to:_to timing:timing];
}

@end

@implementation RNSStackAnimationDimTrack

- (instancetype)initWithColor:(UIColor *)color
                         from:(CGFloat)from
                           to:(CGFloat)to
                       timing:(RNSStackAnimationTiming *)timing
{
  if (self = [super initWithTiming:timing]) {
    _color = color;
    _from = from;
    _to = to;
  }
  return self;
}

- (instancetype)withTiming:(RNSStackAnimationTiming *)timing
{
  return [[[self class] alloc] initWithColor:_color from:_from to:_to timing:timing];
}

@end
