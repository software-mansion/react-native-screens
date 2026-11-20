#import "RNSConversions-FullScreenModal.h"

#import <React/RCTLog.h>

namespace rnscreens::conversion {

RNSFullScreenModalPresentationStyle RNSFullScreenModalPresentationStyleFromHostProp(
    react::RNSFullScreenModalHostPresentationStyle presentationStyle)
{
  switch (presentationStyle) {
    using enum react::RNSFullScreenModalHostPresentationStyle;
    case OverContent:
      return RNSFullScreenModalPresentationStyleOverContent;
    case ReplacingContent:
      return RNSFullScreenModalPresentationStyleReplacingContent;
    default:
      RCTLogError(@"[RNScreens] Unsupported presentationStyle value, falling back to replacingContent.");
      return RNSFullScreenModalPresentationStyleReplacingContent;
  }
}

}; // namespace rnscreens::conversion
