// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#include "RNSSafeAreaViewState.h"

namespace facebook {
namespace react {

#ifdef ANDROID

folly::dynamic RNSSafeAreaViewState::getDynamic() const {
  folly::dynamic insetsValue = folly::dynamic::object();
  insetsValue["top"] = insets.top;
  insetsValue["left"] = insets.left;
  insetsValue["bottom"] = insets.bottom;
  insetsValue["right"] = insets.right;

  folly::dynamic data = folly::dynamic::object();
  data["insets"] = insetsValue;

  return data;
}
#endif

} // namespace react
} // namespace facebook
