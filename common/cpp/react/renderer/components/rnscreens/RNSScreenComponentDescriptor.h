#pragma once

#include <fbjni/fbjni.h>
#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenShadowNode.h"

jint HEADER_HEIGHT = 0;
bool wasLayouted = false;

namespace facebook {
namespace react {

class RNSScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSScreenShadowNode *>(&shadowNode));
    auto &screenShadowNode = static_cast<RNSScreenShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&screenShadowNode));
//    auto &layoutableShadowNode =
//        dynamic_cast<YogaLayoutableShadowNode &>(screenShadowNode);

    auto state =
        std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(
            shadowNode.getState());
//    auto stateData = state->getData();

//    const jni::global_ref<jobject> &fabricUIManager = contextContainer_->at<jni::global_ref<jobject>>("FabricUIManager");

//    const jni::

//    static auto reactApplicationContext = facebook::jni::findClassStatic("com/facebook/react/fabric/FabricUIManager")
//            ->getField<jobject>("reactApplicationCont;
//
//    reactApplicationContext.getId();

//      if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
//          layoutableShadowNode.setSize(
//                  Size{stateData.frameSize.width, stateData.frameSize.height});
//      }

//    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
//        layoutableShadowNode.setSize(
//                Size{stateData.frameSize.width, stateData.frameSize.height});
//    } else {
//        layoutableShadowNode.setPadding({.bottom = static_cast<float>(HEADER_HEIGHT)});
//    }
//      layoutableShadowNode.setPadding({.bottom = static_cast<float>(HEADER_HEIGHT)});

    ConcreteComponentDescriptor::adopt(shadowNode);
  }

};

} // namespace react
} // namespace facebook
