#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif // ANDROID
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSFullWindowOverlayShadowNode.h"

namespace facebook::react {

class RNSFullWindowOverlayComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSFullWindowOverlayShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
