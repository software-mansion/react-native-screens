#pragma once

#if RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSStackScreenComponentView.h"

namespace rnscreens::conversion {

template <typename TargetType, typename InputType>
TargetType convert(InputType) {
  static_assert(
      false, "[RNScreens] Missing template specialisation for demanded types!");
}

template <>
RNSStackScreenActivityMode convert(react::RNSStackScreenActivityMode mode);

}; // namespace rnscreens::conversion

#endif // RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED
