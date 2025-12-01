#pragma once

#ifdef ANDROID
#include <fbjni/fbjni.h>
#include <react/renderer/uimanager/UIManager.h>
#include "RNSScreenShadowNodeCommitHook.h"
#endif // ANDROID
#include <react/debug/react_native_assert.h>
#include <react/renderer/components/rnscreens/Props.h>
#include <react/renderer/components/rnscreens/utils/RectUtil.h>
#include <react/renderer/components/root/RootShadowNode.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include "RNSScreenShadowNode.h"

namespace facebook {
namespace react {

using namespace rnscreens;

class RNSScreenComponentDescriptor final
    : public ConcreteComponentDescriptor<RNSScreenShadowNode> {
 private:
#ifdef ANDROID
  /*
   * A commit hook that triggers on `shadowTreeWillCommit` event,
   * and can read the properties of RootShadowNodes for determining screen
   * orientation.
   */
  mutable std::shared_ptr<RNSScreenShadowNodeCommitHook> commitHook_;
#endif // ANDROID

 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    react_native_assert(dynamic_cast<RNSScreenShadowNode *>(&shadowNode));
    auto &screenShadowNode = static_cast<RNSScreenShadowNode &>(shadowNode);

    react_native_assert(
        dynamic_cast<YogaLayoutableShadowNode *>(&screenShadowNode));
    auto &layoutableShadowNode =
        static_cast<YogaLayoutableShadowNode &>(screenShadowNode);

    auto state =
        std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(
            shadowNode.getState());
    auto stateData = state->getData();
#ifdef ANDROID
    // get
    // featureFlags.experiment.androidResetScreenShadowStateOnOrientationChange
    // from Screen props enable the commit hook only when the developer asks to
    react_native_assert(
        dynamic_cast<const RNSScreenProps *>(
            screenShadowNode.getProps().get()));
    auto props =
        static_cast<const RNSScreenProps *>(screenShadowNode.getProps().get());

    if (!commitHook_ &&
        props->androidResetScreenShadowStateOnOrientationChangeEnabled) {
      // For the the application that needs to react to orientation change
      // as early as possible, we attach a commit hook that checks for the
      // change in the old vs new RootShadowNode. The hook cannot be attached in
      // the constructor because UIManager is still missing from
      // ContextContainer. Instead, we do it here, on the first call to the
      // function.
      commitHook_ =
          std::make_shared<RNSScreenShadowNodeCommitHook>(contextContainer_);
    }

    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      // When we receive dimensions from JVM side we can remove padding used for
      // correction, and we can stop applying height and offset corrections for
      // the frame.
      // TODO: In future, when we have dynamic header height we might want to
      // update Y offset correction here.

#ifdef REACT_NATIVE_DEBUG
      // We use the fact that height correction is disabled once we receive
      // state from the native, so when we have incoming state & height
      // correction is still enabled, we know this is the very first native
      // state update.
      if (screenShadowNode.getFrameCorrectionModes().check(
              FrameCorrectionModes::Mode::FrameHeightCorrection) &&
          !checkFrameSizesEqualWithEps(
              screenShadowNode.layoutMetrics_.frame.size,
              stateData.frameSize)) {
        LOG(ERROR)
            << "[RNScreens] The first frame received from state update: "
            << stateData.frameSize.width << "x" << stateData.frameSize.height
            << " differs from the one expected: "
            << screenShadowNode.layoutMetrics_.frame.size.width << "x"
            << screenShadowNode.layoutMetrics_.frame.size.height
            << ". This is most likely a react-native-screens library bug. Please report this at https://github.com/software-mansion/react-native-screens/issues";
      }
#endif

      screenShadowNode.setPadding({0, 0, 0, 0});
      screenShadowNode.getFrameCorrectionModes().unset(
          FrameCorrectionModes::Mode::FrameHeightCorrection);
      screenShadowNode.getFrameCorrectionModes().unset(
          FrameCorrectionModes::Mode::FrameOriginCorrection);
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    } else if (
        stateData.frameSize.width == 0 && stateData.frameSize.height == 0) {
      // Reset YogaNode so it recalculates its layout. Useful for the case
      // when native orientation changes and react has not been notified yet.
      // The if condition holds true on first render and when it is reset inside
      // RNSScreenShadowNodeCommitHook.
      layoutableShadowNode.setSize({YGUndefined, YGUndefined});
    }
#else
    if (stateData.frameSize.width != 0 && stateData.frameSize.height != 0) {
      layoutableShadowNode.setSize(
          Size{stateData.frameSize.width, stateData.frameSize.height});
    }
#endif // ANDROID
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace react
} // namespace facebook
