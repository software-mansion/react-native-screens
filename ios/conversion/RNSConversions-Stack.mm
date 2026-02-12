#import "RNSConversions-Stack.h"

#if RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED

namespace rnscreens::conversion {

namespace react = facebook::react;

template <>
RNSStackScreenActivityMode convert(react::RNSStackScreenActivityMode mode)
{
  return static_cast<RNSStackScreenActivityMode>(mode);
};

}; // namespace rnscreens::conversion

#endif // RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED
