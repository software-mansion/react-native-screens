#pragma once

#import <react/renderer/components/rnscreens/Props.h>
#import "RNSEnums.h"

namespace rnscreens::conversion {

RNSBlurEffectStyle RNSBlurEffectStyleFromRNSBottomTabsTabBarBlurEffect(
    facebook::react::RNSBottomTabsTabBarBlurEffect blurEffect);

};
