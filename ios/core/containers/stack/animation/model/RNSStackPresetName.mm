#import "RNSStackPresetName.h"
#import "RNSAssert.h"

// One entry per `RNSStackPresetName`. The strings are the preset names of the `animation` prop: keep them in sync with
// `StackScreenAnimationPresetName` in `src/components/stack/screen/animation/types.ts`.
static const struct {
  RNSStackPresetName name;
  const char *string;
} kRNSStackPresetNames[] = {
    {RNSStackPresetNameDefault, "default"},
    {RNSStackPresetNameNone, "none"},
    {RNSStackPresetNameFade, "fade"},
    {RNSStackPresetNameSlideFromRight, "slideFromRight"},
    {RNSStackPresetNameSlideFromLeft, "slideFromLeft"},
    {RNSStackPresetNameSlideFromTrailing, "slideFromTrailing"},
    {RNSStackPresetNameSlideFromLeading, "slideFromLeading"},
    {RNSStackPresetNameSlideFromBottom, "slideFromBottom"},
    {RNSStackPresetNameSlideFromTop, "slideFromTop"},
    {RNSStackPresetNameFadeFromBottom, "fadeFromBottom"},
    {RNSStackPresetNameFadeFromTop, "fadeFromTop"},
    {RNSStackPresetNameIosFromRight, "iosFromRight"},
    {RNSStackPresetNameIosFromLeft, "iosFromLeft"},
    {RNSStackPresetNameIosFromTrailing, "iosFromTrailing"},
    {RNSStackPresetNameIosFromLeading, "iosFromLeading"},
};

NSString *RNSStackPresetNameToString(RNSStackPresetName name)
{
  for (const auto &entry : kRNSStackPresetNames) {
    if (entry.name == name) {
      return @(entry.string);
    }
  }
  RNSAssert(NO, @"[RNScreens] Animation preset %ld has no name.", static_cast<long>(name));
  return @"";
}

BOOL RNSStackPresetNameFromString(NSString *string, RNSStackPresetName *outName)
{
  for (const auto &entry : kRNSStackPresetNames) {
    if (strcmp(entry.string, string.UTF8String) == 0) {
      *outName = entry.name;
      return YES;
    }
  }
  return NO;
}
