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
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
