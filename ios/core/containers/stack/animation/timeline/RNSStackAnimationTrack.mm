#import "RNSStackAnimationTrack.h"
#import "RNSStackAnimationTiming.h"

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

+ (NSArray<RNSStackAnimationTrack *> *)tracks:(NSArray<RNSStackAnimationTrack *> *)tracks scaledBy:(double)factor
{
  NSMutableArray<RNSStackAnimationTrack *> *scaled = [NSMutableArray arrayWithCapacity:tracks.count];
  for (RNSStackAnimationTrack *track in tracks) {
    [scaled addObject:[track withTiming:[track.timing scaledBy:factor]]];
  }
  return scaled;
}

+ (NSArray<RNSStackAnimationTrack *> *)tracks:(NSArray<RNSStackAnimationTrack *> *)tracks
                                    retimedTo:(NSInteger)durationMs
{
  NSInteger endMs = 0;
  for (RNSStackAnimationTrack *track in tracks) {
    endMs = MAX(endMs, track.timing.endMs);
  }
  return endMs == 0 ? tracks : [self tracks:tracks scaledBy:durationMs / static_cast<double>(endMs)];
}

+ (NSArray<RNSStackAnimationTrack *> *)tracks:(NSArray<RNSStackAnimationTrack *> *)tracks
                                   withEasing:(RNSStackAnimationEasing *)easing
{
  NSMutableArray<RNSStackAnimationTrack *> *eased = [NSMutableArray arrayWithCapacity:tracks.count];
  for (RNSStackAnimationTrack *track in tracks) {
    [eased addObject:[track withTiming:[track.timing withEasing:easing]]];
  }
  return eased;
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

+ (CGFloat)restValueOfViewProperty:(RNSStackAnimationViewProperty)property
{
  switch (property) {
    case RNSStackAnimationViewPropertyOpacity:
    case RNSStackAnimationViewPropertyScale:
    case RNSStackAnimationViewPropertyScaleX:
    case RNSStackAnimationViewPropertyScaleY:
      return 1;
    case RNSStackAnimationViewPropertyRotate:
      return 0;
  }
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
