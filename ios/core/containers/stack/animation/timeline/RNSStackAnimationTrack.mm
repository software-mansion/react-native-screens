#import "RNSStackAnimationTrack.h"

@implementation RNSStackAnimationTrack

- (instancetype)initWithTiming:(RNSStackAnimationTiming *)timing
{
  if (self = [super init]) {
    _timing = timing;
  }
  return self;
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

@end
