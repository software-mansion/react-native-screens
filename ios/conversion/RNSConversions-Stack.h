#pragma once

#if defined(__cplusplus)

#import <UIKit/UIKit.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSHeaderItemPlacement.h"
#import "RNSHeaderItemSpacerPlacement.h"
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

template <>
RNSHeaderItemPlacement convert(react::RNSStackHeaderItemIOSPlacement placement);

template <>
RNSHeaderItemSpacerPlacement convert(
    react::RNSStackHeaderItemSpacerIOSPlacement placement);

template <>
UINavigationItemBackButtonDisplayMode convert(
    react::RNSStackHeaderConfigIOSBackButtonDisplayMode displayMode);

}; // namespace rnscreens::conversion

#endif // defined(__cplusplus)
