#import "RNSStackAnimationPresetConfig.h"
#import "RNSAssert.h"

// One entry per `RNSStackAnimationPresetName`. The strings are the preset names of the `animation` prop: keep them in
// sync with `StackScreenAnimationPresetName` in `src/components/stack/screen/animation/types.ts`.
static const struct {
  RNSStackAnimationPresetName name;
  const char *string;
} kRNSStackAnimationPresetNames[] = {
    {RNSStackAnimationPresetNameDefault, "default"},
    {RNSStackAnimationPresetNameNone, "none"},
    {RNSStackAnimationPresetNameFade, "fade"},
    {RNSStackAnimationPresetNameSlideFromRight, "slideFromRight"},
    {RNSStackAnimationPresetNameSlideFromLeft, "slideFromLeft"},
    {RNSStackAnimationPresetNameSlideFromTrailing, "slideFromTrailing"},
    {RNSStackAnimationPresetNameSlideFromLeading, "slideFromLeading"},
    {RNSStackAnimationPresetNameSlideFromBottom, "slideFromBottom"},
    {RNSStackAnimationPresetNameSlideFromTop, "slideFromTop"},
    {RNSStackAnimationPresetNameFadeFromBottom, "fadeFromBottom"},
    {RNSStackAnimationPresetNameFadeFromTop, "fadeFromTop"},
    {RNSStackAnimationPresetNameIosFromRight, "iosFromRight"},
    {RNSStackAnimationPresetNameIosFromLeft, "iosFromLeft"},
    {RNSStackAnimationPresetNameIosFromTrailing, "iosFromTrailing"},
    {RNSStackAnimationPresetNameIosFromLeading, "iosFromLeading"},
};

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

+ (nullable RNSStackAnimationPresetConfig *)configNamed:(NSString *)string
{
  for (const auto &entry : kRNSStackAnimationPresetNames) {
    if (strcmp(entry.string, string.UTF8String) == 0) {
      return [[RNSStackAnimationPresetConfig alloc] initWithName:entry.name];
    }
  }
  return nil;
}

+ (NSString *)stringFromName:(RNSStackAnimationPresetName)name
{
  for (const auto &entry : kRNSStackAnimationPresetNames) {
    if (entry.name == name) {
      return @(entry.string);
    }
  }
  RNSAssert(NO, @"[RNScreens] Animation preset %ld has no name.", static_cast<long>(name));
  return @"";
}

@end
