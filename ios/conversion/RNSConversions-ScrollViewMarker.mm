#import "RNSConversions-ScrollViewMarker.h"

#if RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED

#import <React/RCTLog.h>

namespace react = facebook::react;

#define SWITCH_EDGE_EFFECT(X)                              \
  switch (edgeEffect) {                                    \
    using enum react::X;                                   \
    case Automatic:                                        \
      return RNSScrollEdgeEffectAutomatic;                 \
    case Hard:                                             \
      return RNSScrollEdgeEffectHard;                      \
    case Soft:                                             \
      return RNSScrollEdgeEffectSoft;                      \
    case Hidden:                                           \
      return RNSScrollEdgeEffectHidden;                    \
    default:                                               \
      RCTLogError(@"[RNScreens] unsupported edge effect"); \
      return RNSScrollEdgeEffectAutomatic;                 \
  }

#define EDGE_EFFECT_CONV_FUNC_IMPL(direction)                             \
  RNSScrollEdgeEffect RNSScrollEdgeEffectFromSVM##direction##EdgeEffect(  \
      react::RNSScrollViewMarker##direction##ScrollEdgeEffect edgeEffect) \
  {                                                                       \
    SWITCH_EDGE_EFFECT(RNSScrollViewMarker##direction##ScrollEdgeEffect); \
  }

namespace rnscreens::conversion {

EDGE_EFFECT_CONV_FUNC_IMPL(Left);
EDGE_EFFECT_CONV_FUNC_IMPL(Top);
EDGE_EFFECT_CONV_FUNC_IMPL(Right);
EDGE_EFFECT_CONV_FUNC_IMPL(Bottom);

}; // namespace rnscreens::conversion

#undef EDGE_EFFECT_CONV_FUNC_IMPL
#undef SWITCH_EDGE_EFFECT

#endif // RCT_NEW_ARCH_ENABLED && RNS_GAMMA_ENABLED
