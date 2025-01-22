#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSFullWindowOverlayShadowNode.h"

namespace facebook::react {

using namespace rnscreens;

class RNSFullWindowOverlayComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSFullWindowOverlayShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
