#pragma once

#include <fbjni/fbjni.h>
#include <react/debug/react_native_assert.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenShadowNode.h"

jint HEADER_HEIGHT = 0;
extern jclass RNSPACKAGE_REFERENCE;

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
    auto &layoutableShadowNode =
        dynamic_cast<YogaLayoutableShadowNode &>(screenShadowNode);

    auto state =
        std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();

//    const jni::global_ref<jobject> &fabricUIManager = contextContainer_->at<jni::global_ref<jobject>>("FabricUIManager");

//    const jni::

//    static auto reactApplicationContext = facebook::jni::findClassStatic("com/facebook/react/fabric/FabricUIManager")
//            ->getField<jobject>("reactApplicationCont;
//
//    reactApplicationContext.getId();
//
      if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
          layoutableShadowNode.setPadding({.bottom = 0});
          layoutableShadowNode.setSize(
                  Size{stateData.frameSize.width, stateData.frameSize.height});

      }
      else {
          JNIEnv *env = facebook::jni::Environment::current();
          if (env == nullptr) {
              // We can basically crash here
              LOG(ERROR) << "Failed to retrieve env\n";
          }
          jmethodID computeDummyLayoutID = env->GetMethodID(RNSPACKAGE_REFERENCE, "computeDummyLayout", "()F");
          if (computeDummyLayoutID == nullptr) {
              LOG(ERROR) << "Failed to retrieve computeDummyLayout method ID";
          }

          jmethodID getInstanceMethodID = env->GetStaticMethodID(RNSPACKAGE_REFERENCE, "getInstance", "()Lcom/swmansion/rnscreens/RNScreensPackage;");
          if (getInstanceMethodID == nullptr) {
              LOG(ERROR) << "Failed to retrieve getInstanceMethodID";
          }

          jobject packageInstance = env->CallStaticObjectMethod(RNSPACKAGE_REFERENCE, getInstanceMethodID);

          if (packageInstance == nullptr) {
              LOG(ERROR) << "Failed to retrieve packageInstance";
          }

          jfloat headerHeight = env->CallFloatMethod(packageInstance, computeDummyLayoutID);

          layoutableShadowNode.setPadding({.bottom = static_cast<float>(headerHeight)});
      }

//    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
//        layoutableShadowNode.setSize(
//                Size{stateData.frameSize.width, stateData.frameSize.height});
//    } else {
//        layoutableShadowNode.setPadding({.bottom = static_cast<float>(HEADER_HEIGHT)});
//    }

    ConcreteComponentDescriptor::adopt(shadowNode);
  }

};

} // namespace react
} // namespace facebook
