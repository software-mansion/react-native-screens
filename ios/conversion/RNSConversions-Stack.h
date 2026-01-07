#pragma once

#if RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSStackScreenComponentView.h"
#import "always_false.h"

namespace rnscreens::conversion {

template <typename TargetType, typename InputType>
TargetType convert(InputType) {
  static_assert(
      rnscreens::always_false<TargetType>::value,
      "[RNScreens] Missing template specialisation for demanded types!");
}

template <>
RNSStackScreenActivityMode convert(react::RNSStackScreenActivityMode mode);

}; // namespace rnscreens::conversion

#endif // RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED
