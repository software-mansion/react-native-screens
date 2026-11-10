#import "RNSStackAnimationPresetName.h"
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

NSString *RNSStackAnimationPresetNameToString(RNSStackAnimationPresetName name)
{
  for (const auto &entry : kRNSStackAnimationPresetNames) {
    if (entry.name == name) {
      return @(entry.string);
    }
  }
  RNSAssert(NO, @"[RNScreens] Animation preset %ld has no name.", static_cast<long>(name));
  return @"";
}

BOOL RNSStackAnimationPresetNameFromString(NSString *string, RNSStackAnimationPresetName *outName)
{
  for (const auto &entry : kRNSStackAnimationPresetNames) {
    if (strcmp(entry.string, string.UTF8String) == 0) {
      *outName = entry.name;
      return YES;
    }
  }
  return NO;
}
