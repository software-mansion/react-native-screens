#import "RNSStackPresetConfig.h"

@implementation RNSStackPresetConfig

- (instancetype)initWithName:(RNSStackPresetName)name
{
  if (self = [super init]) {
    _name = name;
  }
  return self;
}

+ (RNSStackPresetConfig *)defaultConfig
{
  static RNSStackPresetConfig *defaultConfig;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    defaultConfig = [[RNSStackPresetConfig alloc] initWithName:RNSStackPresetNameDefault];
  });
  return defaultConfig;
}

@end
