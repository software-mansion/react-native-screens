#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenStackHeaderSubviewShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSScreenStackHeaderSubviewComponentDescriptor final
    : public ConcreteComponentDescriptor<
          RNSScreenStackHeaderSubviewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    // Note: Be very careful with calling `shadowNode.setSize` here. By doing
    // that, you are likely to introduce a regressions on both platforms. See:
    // https://github.com/software-mansion/react-native-screens/pull/2905

    ConcreteComponentDescriptor::adopt(shadowNode);

#if !defined(ANDROID)
    auto &headerSubviewShadowNode =
        static_cast<RNSScreenStackHeaderSubviewShadowNode &>(shadowNode);
    const auto &props = headerSubviewShadowNode.getConcreteProps();
    const auto &stateData = headerSubviewShadowNode.getStateData();
    const bool isTitleSubview =
        props.type == RNSScreenStackHeaderSubviewType::Center ||
        props.type == RNSScreenStackHeaderSubviewType::Title;

    if (isTitleSubview && stateData.frameSize.width > 0) {
      headerSubviewShadowNode.constrainMaxWidth(stateData.frameSize.width);
    }
#endif // !ANDROID
  }
};

} // namespace facebook::react
