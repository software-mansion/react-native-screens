#import "RNSStackAnimationLength.h"

@implementation RNSStackAnimationLength

- (instancetype)initWithUnit:(RNSStackAnimationLengthUnit)unit value:(CGFloat)value
{
  if (self = [super init]) {
    _unit = unit;
    _value = value;
  }
  return self;
}

+ (instancetype)points:(CGFloat)points
{
  return [[self alloc] initWithUnit:RNSStackAnimationLengthUnitPoints value:points];
}

+ (instancetype)fraction:(CGFloat)fraction
{
  return [[self alloc] initWithUnit:RNSStackAnimationLengthUnitFraction value:fraction];
}

+ (RNSStackAnimationLength *)zero
{
  static RNSStackAnimationLength *zero;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    zero = [RNSStackAnimationLength points:0];
  });
  return zero;
}

- (instancetype)negated
{
  return [[[self class] alloc] initWithUnit:_unit value:-_value];
}

@end
