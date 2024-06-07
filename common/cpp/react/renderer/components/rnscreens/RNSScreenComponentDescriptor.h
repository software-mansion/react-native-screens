#pragma once

#include <fbjni/fbjni.h>
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

class RNSScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  static constexpr const char *kRnsPackageClassPath =
      "com/swmansion/rnscreens/RNScreensPackage";

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

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setPadding({.bottom = 0});
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    } else {
      auto headerConfigChildOpt = findHeaderConfigChild(layoutableShadowNode);
      int fontSize = -1;
      if (headerConfigChildOpt) {
        const auto &headerConfigChild = headerConfigChildOpt->get();
        const auto &headerProps =
            *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(
                headerConfigChild->getProps());
        fontSize = headerProps.titleFontSize;
      }

      const auto headerHeight = findHeaderHeight(fontSize);
      layoutableShadowNode.setPadding(
          {.bottom = static_cast<float>(headerHeight.value_or(0))});
    }
    ConcreteComponentDescriptor::adopt(shadowNode);
  }

  std::optional<std::reference_wrapper<const ShadowNode::Shared>>
  findHeaderConfigChild(
      const YogaLayoutableShadowNode &screenShadowNode) const {
    for (const ShadowNode::Shared &child : screenShadowNode.getChildren()) {
      if (std::strcmp(
              child->getComponentName(), "RNSScreenStackHeaderConfig") == 0) {
        return {std::ref(child)};
      }
    }
    return std::nullopt;
  }

  std::optional<float> findHeaderHeight(const int fontSize) const {
    JNIEnv *env = facebook::jni::Environment::current();
    if (env == nullptr) {
      // We can basically crash here
      LOG(ERROR) << "Failed to retrieve env\n";
      return {};
    }

    jclass rnsPackageClass = env->FindClass(kRnsPackageClassPath);
    if (rnsPackageClass == nullptr) {
      LOG(ERROR) << "Failed to find class with id "
                 << "";
      return {};
    }

    jmethodID computeDummyLayoutID =
        env->GetMethodID(rnsPackageClass, "computeDummyLayout", "(I)F");
    if (computeDummyLayoutID == nullptr) {
      LOG(ERROR) << "Failed to retrieve computeDummyLayout method ID";
      return {};
    }

    jmethodID getInstanceMethodID = env->GetStaticMethodID(
        rnsPackageClass,
        "getInstance",
        "()Lcom/swmansion/rnscreens/RNScreensPackage;");
    if (getInstanceMethodID == nullptr) {
      LOG(ERROR) << "Failed to retrieve getInstanceMethodID";
      return {};
    }

    jobject packageInstance =
        env->CallStaticObjectMethod(rnsPackageClass, getInstanceMethodID);
    if (packageInstance == nullptr) {
      LOG(ERROR) << "Failed to retrieve packageInstance";
      return {};
    }

    jfloat headerHeight =
        env->CallFloatMethod(packageInstance, computeDummyLayoutID, fontSize);

    return {headerHeight};
  }
};

} // namespace react
} // namespace facebook
