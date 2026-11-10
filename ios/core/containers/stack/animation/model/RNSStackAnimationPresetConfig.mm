#import "RNSStackAnimationPresetConfig.h"

@implementation RNSStackAnimationPresetConfig

- (instancetype)initWithName:(RNSStackAnimationPresetName)name
{
  if (self = [super init]) {
    _name = name;
  }
  return self;
}

+ (RNSStackAnimationPresetConfig *)defaultConfig
{
  static RNSStackAnimationPresetConfig *defaultConfig;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    defaultConfig = [[RNSStackAnimationPresetConfig alloc] initWithName:RNSStackAnimationPresetNameDefault];
  });
  return defaultConfig;
}

@end
