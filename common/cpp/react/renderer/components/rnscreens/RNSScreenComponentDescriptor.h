#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#endif
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenShadowNode.h"

namespace rnscreens {

float gHeaderHeightCorrection = 0.f;

}

namespace facebook {
namespace react {

class RNSScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  static constexpr const char *kRnsPackageClassPath =
      "com/swmansion/rnscreens/RNScreensPackage";

  static constexpr const int kFontSizeUnset = -1;

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

#ifdef ANDROID
    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      screenShadowNode.setTopMargin(0.f);
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    } else {
      auto headerConfigChildOpt = findHeaderConfigChild(layoutableShadowNode);
      int fontSize = kFontSizeUnset;
      bool headerHidden = true;

      if (headerConfigChildOpt) {
        const auto &headerConfigChild = headerConfigChildOpt->get();
        const auto &headerProps =
            *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(
                headerConfigChild->getProps());
        fontSize = headerProps.titleFontSize;
        headerHidden = headerProps.hidden;
      }

      const auto headerHeight =
          headerHidden ? 0.f : findHeaderHeight(fontSize).value_or(0.f);

      screenShadowNode.setTopMargin(headerHeight);
    }
#else
    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }
#endif // ANDROID
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
    return {};
  }

#ifdef ANDROID
  std::optional<float> findHeaderHeight(const int fontSize) const {
    JNIEnv *env = facebook::jni::Environment::current();

    if (env == nullptr) {
      LOG(ERROR) << "[RNScreens] Failed to retrieve env\n";
      return {};
    }

    jclass rnsPackageClass = env->FindClass(kRnsPackageClassPath);

    if (rnsPackageClass == nullptr) {
      LOG(ERROR) << "[RNScreens] Failed to find class with id "
                 << kRnsPackageClassPath;
      return {};
    }

    jmethodID computeDummyLayoutID =
        env->GetMethodID(rnsPackageClass, "computeDummyLayout", "(I)F");

    if (computeDummyLayoutID == nullptr) {
      LOG(ERROR)
          << "[RNScreens] Failed to retrieve computeDummyLayout method ID";
      return {};
    }

    jmethodID getInstanceMethodID = env->GetStaticMethodID(
        rnsPackageClass,
        "getInstance",
        "()Lcom/swmansion/rnscreens/RNScreensPackage;");

    if (getInstanceMethodID == nullptr) {
      LOG(ERROR) << "[RNScreens] Failed to retrieve getInstanceMethodID";
      return {};
    }

    jobject packageInstance =
        env->CallStaticObjectMethod(rnsPackageClass, getInstanceMethodID);

    if (packageInstance == nullptr) {
      LOG(ERROR)
          << "[RNScreens] Failed to retrieve packageInstance or the package instance was null on JVM side";
      return {};
    }

    jfloat headerHeight =
        env->CallFloatMethod(packageInstance, computeDummyLayoutID, fontSize);

    return {headerHeight};
  }
#endif // ANDROID
};

} // namespace react
} // namespace facebook
