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

+ (RNSStackAnimationPresetConfig *)noneConfig
{
  static RNSStackAnimationPresetConfig *noneConfig;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    noneConfig = [[RNSStackAnimationPresetConfig alloc] initWithName:RNSStackAnimationPresetNameNone];
  });
  return noneConfig;
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

+ (BOOL)presetNamed:(RNSStackAnimationPresetName)name isAllowedAtLevel:(RNSStackAnimationPresetLevel)level
{
  switch (name) {
    case RNSStackAnimationPresetNameDefault:
      return level == RNSStackAnimationPresetLevelAnimation;
    case RNSStackAnimationPresetNameIosFromRight:
    case RNSStackAnimationPresetNameIosFromLeft:
    case RNSStackAnimationPresetNameIosFromTrailing:
    case RNSStackAnimationPresetNameIosFromLeading:
      return level != RNSStackAnimationPresetLevelMotion;
    default:
      return YES;
  }
}

+ (BOOL)presetNamed:(RNSStackAnimationPresetName)name
      acceptsOption:(RNSStackAnimationPresetOption)option
            atLevel:(RNSStackAnimationPresetLevel)level
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
      return option != RNSStackAnimationPresetOptionDistance || level == RNSStackAnimationPresetLevelMotion;
    case RNSStackAnimationPresetNameFadeFromBottom:
    case RNSStackAnimationPresetNameFadeFromTop:
      return YES;
  }
}

+ (NSString *)stringFromLevel:(RNSStackAnimationPresetLevel)level
{
  switch (level) {
    case RNSStackAnimationPresetLevelAnimation:
      return @"the whole animation";
    case RNSStackAnimationPresetLevelTransition:
      return @"a push or pop transition";
    case RNSStackAnimationPresetLevelMotion:
      return @"one screen's motion";
  }
}

@end
