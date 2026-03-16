#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

namespace yoga = facebook::yoga;
using namespace rnscreens;

extern const char RNSScreenComponentName[] = "RNSScreen";

Point RNSScreenShadowNode::getContentOriginOffset(
    bool /*includeTransform*/) const {
  auto stateData = getStateData();
  return stateData.contentOffset;
}

std::optional<std::reference_wrapper<const std::shared_ptr<const ShadowNode>>>
findHeaderConfigChild(const YogaLayoutableShadowNode &screenShadowNode) {
  for (const std::shared_ptr<const ShadowNode> &child :
       screenShadowNode.getChildren()) {
    if (std::strcmp(child->getComponentName(), "RNSScreenStackHeaderConfig") ==
        0) {
      return {std::cref(child)};
    }
  }
  return {};
}

#ifdef ANDROID
static constexpr const char *kScreenDummyLayoutHelperClass =
    "com/swmansion/rnscreens/utils/ScreenDummyLayoutHelper";

std::optional<float> findHeaderHeight(
    const int fontSize,
    const bool isTitleEmpty) {
  JNIEnv *env = facebook::jni::Environment::current();

  if (env == nullptr) {
    LOG(ERROR) << "[RNScreens] Failed to retrieve env\n";
    return {};
  }

  jclass layoutHelperClass = env->FindClass(kScreenDummyLayoutHelperClass);

  if (layoutHelperClass == nullptr) {
    LOG(ERROR) << "[RNScreens] Failed to find class with id "
               << kScreenDummyLayoutHelperClass;
    return {};
  }

  jmethodID computeDummyLayoutID =
      env->GetMethodID(layoutHelperClass, "computeDummyLayout", "(IZ)F");

  if (computeDummyLayoutID == nullptr) {
    LOG(ERROR) << "[RNScreens] Failed to retrieve computeDummyLayout method ID";
    return {};
  }

  jmethodID getInstanceMethodID = env->GetStaticMethodID(
      layoutHelperClass,
      "getInstance",
      "()Lcom/swmansion/rnscreens/utils/ScreenDummyLayoutHelper;");

  if (getInstanceMethodID == nullptr) {
    LOG(ERROR) << "[RNScreens] Failed to retrieve getInstanceMethodID";
    return {};
  }

  jobject packageInstance =
      env->CallStaticObjectMethod(layoutHelperClass, getInstanceMethodID);

  if (packageInstance == nullptr) {
    LOG(ERROR)
        << "[RNScreens] Failed to retrieve packageInstance or the package instance was null on JVM side";
    return {};
  }

  jfloat headerHeight = env->CallFloatMethod(
      packageInstance, computeDummyLayoutID, fontSize, isTitleEmpty);

  return {headerHeight};
}
#endif // ANDROID

void RNSScreenShadowNode::appendChild(
    const std::shared_ptr<const ShadowNode> &child) {
  YogaLayoutableShadowNode::appendChild(child);
#ifdef ANDROID
  const auto &stateData = getStateData();
  if (stateData.frameSize.width == 0 || stateData.frameSize.height == 0) {
    // This code path should be executed only on the very first (few)
    // layout(s), when we haven't received state update from JVM side yet.
    auto headerConfigChildOpt = findHeaderConfigChild(*this);
    auto &screenShadowNode = static_cast<RNSScreenShadowNode &>(*this);

    // During creation of the shadow node children are not attached yet.
    // We also do not want to set any padding in case.
    if (headerConfigChildOpt) {
      const auto &headerConfigChild = headerConfigChildOpt->get();
      const auto &headerProps =
          *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(
              headerConfigChild->getProps());

      const auto headerHeight = headerProps.hidden
          ? 0.f
          : findHeaderHeight(
                headerProps.titleFontSize, headerProps.title.empty())
                .value_or(0.f);

      screenShadowNode.setPadding({0, 0, 0, headerHeight});
      screenShadowNode.setHeaderHeight(headerHeight);
      screenShadowNode.getFrameCorrectionModes().set(
          FrameCorrectionModes::Mode(
              FrameCorrectionModes::Mode::FrameHeightCorrection |
              FrameCorrectionModes::Mode::FrameOriginCorrection));
    }
  }
#endif // ANDROID
}

void RNSScreenShadowNode::layout(facebook::react::LayoutContext layoutContext) {
  YogaLayoutableShadowNode::layout(layoutContext);

#ifdef ANDROID
  applyFrameCorrections();
#endif // ANDROID
}

#ifdef ANDROID
void RNSScreenShadowNode::applyFrameCorrections() {
  ensureUnsealed();

  // On the very first layout we want to correct both Y offset and frame size.
  // On consecutive layouts we want to correct only Y offset, as the frame size
  // is received from JVM side. This is done so if the Screen dimensions are
  // read from ShadowTree (e.g by reanimated) they have chance of being
  // accurate. On JVM side we do ignore this frame anyway, because
  // ScreenStackViewManager.needsCustomLayoutForChildren() == true.
  const auto &stateData = getStateData();
  const float lastKnownHeaderHeight = stateData.getLastKnownHeaderHeight();
  const auto &headerCorrectionModes = stateData.getHeaderCorrectionModes();
  layoutMetrics_.frame.origin.y += lastKnownHeaderHeight *
      headerCorrectionModes.check(
          FrameCorrectionModes::Mode::FrameOriginCorrection);
  layoutMetrics_.frame.size.height -= lastKnownHeaderHeight *
      headerCorrectionModes.check(
          FrameCorrectionModes::Mode::FrameHeightCorrection);
}

void RNSScreenShadowNode::setHeaderHeight(float headerHeight) {
  getStateDataMutable().setHeaderHeight(headerHeight);
}

FrameCorrectionModes &RNSScreenShadowNode::getFrameCorrectionModes() {
  return getStateDataMutable().getFrameCorrectionModes();
}

void RNSScreenShadowNode::resetFrameSizeState() {
  getStateDataMutable().frameSize = {0, 0};
}

RNSScreenShadowNode::StateData &RNSScreenShadowNode::getStateDataMutable() {
  // We assume that this method is called to mutate the data, so we ensure
  // we're unsealed.
  ensureUnsealed();
  return const_cast<RNSScreenShadowNode::StateData &>(getStateData());
}

#endif // ANDROID

} // namespace react
} // namespace facebook
