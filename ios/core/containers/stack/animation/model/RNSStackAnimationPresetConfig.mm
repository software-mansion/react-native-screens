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
  return [self initWithName:name options:RNSStackAnimationPresetOptions.none];
}

- (instancetype)initWithName:(RNSStackAnimationPresetName)name options:(RNSStackAnimationPresetOptions *)options
{
  if (self = [super init]) {
    _name = name;
    _options = options;
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

+ (BOOL)presetNamed:(RNSStackAnimationPresetName)name acceptsOption:(RNSStackAnimationPresetOption)option
{
  switch (name) {
    case RNSStackAnimationPresetNameDefault:
    case RNSStackAnimationPresetNameNone:
      return NO;
    case RNSStackAnimationPresetNameFade:
    case RNSStackAnimationPresetNameIosFromRight:
    case RNSStackAnimationPresetNameIosFromLeft:
    case RNSStackAnimationPresetNameIosFromTrailing:
    case RNSStackAnimationPresetNameIosFromLeading:
      return option != RNSStackAnimationPresetOptionDistance;
    // A shortened slide is the parallax recede of one screen (the background of `iosFrom*`); a whole transition keeps
    // the full width.
    case RNSStackAnimationPresetNameSlideFromRight:
    case RNSStackAnimationPresetNameSlideFromLeft:
    case RNSStackAnimationPresetNameSlideFromTrailing:
    case RNSStackAnimationPresetNameSlideFromLeading:
    case RNSStackAnimationPresetNameSlideFromBottom:
    case RNSStackAnimationPresetNameSlideFromTop:
      return option != RNSStackAnimationPresetOptionDistance;
    case RNSStackAnimationPresetNameFadeFromBottom:
    case RNSStackAnimationPresetNameFadeFromTop:
      return YES;
  }
}

@end
