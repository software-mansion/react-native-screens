#pragma once

#if defined(__cplusplus)

#include <cxxreact/ReactNativeVersion.h>

namespace facebook {
namespace react {

inline bool is082PrereleaseOrLower() {
  return (
      ReactNativeVersion.Minor <= 81 ||
      (ReactNativeVersion.Minor == 82 && ReactNativeVersion.Prerelease != ""));
}

} // namespace react
} // namespace facebook

#endif
