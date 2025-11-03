#pragma once

#if defined(__cplusplus)

#include <cxxreact/ReactNativeVersion.h>

#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82
#define RNS_INVALIDATING_INTERFACE RNSViewControllerInvalidating
#elif !RCT_NEW_ARCH_ENABLED
#define RNS_INVALIDATING_INTERFACE RCTInvalidating
#else
#define RNS_INVALIDATING_INTERFACE NSObject
#endif

namespace facebook {
namespace react {

inline bool is082PrereleaseOrLower()
{
  return (ReactNativeVersion.Minor <= 81 || (ReactNativeVersion.Minor == 82 && ReactNativeVersion.Prerelease != ""));
}

} // namespace react
} // namespace facebook

#endif
