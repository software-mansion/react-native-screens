#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "../utils/LayoutFromState.h"
#include "RNSScreenStackHeaderSubviewShadowNode.h"
#include "utils/RectUtil.h"

namespace facebook::react {

using namespace rnscreens;

class RNSScreenStackHeaderSubviewComponentDescriptor final
    : public ConcreteComponentDescriptor<
          RNSScreenStackHeaderSubviewShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(
        dynamic_cast<RNSScreenStackHeaderSubviewShadowNode *>(&shadowNode));
    auto &subviewShadowNode =
        static_cast<RNSScreenStackHeaderSubviewShadowNode &>(shadowNode);

    // Note: Be very careful with calling `shadowNode.setSize` here. By doing
    // that, you are likely to introduce a regressions on both platforms. See:
    // https://github.com/software-mansion/react-native-screens/pull/2905

    // `layout()` takes the frame origin from state. Marking the layout dirty
    // doesn't touch the Yoga style, so the subview still sizes to its content.
    rnscreens::dirtyLayoutIfFrameOriginStale(subviewShadowNode);

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
