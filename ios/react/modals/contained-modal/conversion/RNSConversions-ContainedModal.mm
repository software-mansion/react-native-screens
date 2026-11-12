#import "RNSConversions-ContainedModal.h"

namespace rnscreens::conversion {

RNSContainedModalPresentationStyle ContainedModalPresentationStyleFromHostProp(
    react::RNSContainedModalHostPresentationStyle presentationStyle)
{
  using enum react::RNSContainedModalHostPresentationStyle;

  switch (presentationStyle) {
    case ReplacingContent:
      return RNSContainedModalPresentationStyleReplacingContent;
    case OverContent:
    default:
      return RNSContainedModalPresentationStyleOverContent;
  }
}

} // namespace rnscreens::conversion
