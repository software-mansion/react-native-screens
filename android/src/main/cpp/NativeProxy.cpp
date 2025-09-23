#include <fbjni/fbjni.h>
#include <react/fabric/Binding.h>
#include <react/renderer/scheduler/Scheduler.h>

#include <string>

#include "NativeProxy.h"

using namespace facebook;
using namespace react;

namespace rnscreens {

NativeProxy::NativeProxy(jni::alias_ref<NativeProxy::javaobject> jThis)
    : javaPart_(jni::make_global(jThis)) {}

void NativeProxy::registerNatives() {
  registerHybrid(
      {makeNativeMethod("initHybrid", NativeProxy::initHybrid),
       makeNativeMethod(
           "nativeAddMutationsListener",
           NativeProxy::nativeAddMutationsListener),
       makeNativeMethod("invalidateNative", NativeProxy::invalidateNative)});
}

void NativeProxy::nativeAddMutationsListener(
    jni::alias_ref<facebook::react::JFabricUIManager::javaobject>
        fabricUIManager) {
  auto uiManager =
      fabricUIManager->getBinding()->getScheduler()->getUIManager();

  if (!screenRemovalListener_) {
    screenRemovalListener_ =
        std::make_shared<RNSScreenRemovalListener>([this](int tag) {
          static const auto method =
              javaPart_->getClass()->getMethod<void(jint)>(
                  "notifyScreenRemoved");
          method(javaPart_, tag);
        });
  }

  for (auto it = coordinatorsWithMountingOverrides_.begin();
       it != coordinatorsWithMountingOverrides_.end();) {
    if (it->expired()) {
      it = coordinatorsWithMountingOverrides_.erase(it);
    } else {
      ++it;
    }
  }

  uiManager->getShadowTreeRegistry().enumerate(
      [this](const facebook::react::ShadowTree &shadowTree, bool &stop) {
        auto coordinator = shadowTree.getMountingCoordinator();
        if (!coordinator) {
          return;
        }

        std::weak_ptr<const facebook::react::MountingCoordinator> weakCoord =
            coordinator;

        if (coordinatorsWithMountingOverrides_.find(weakCoord) ==
            coordinatorsWithMountingOverrides_.end()) {
          coordinator->setMountingOverrideDelegate(screenRemovalListener_);
          coordinatorsWithMountingOverrides_.insert(weakCoord);
        }
      });
}

jni::local_ref<NativeProxy::jhybriddata> NativeProxy::initHybrid(
    jni::alias_ref<jhybridobject> jThis) {
  return makeCxxInstance(jThis);
}

void NativeProxy::invalidateNative() {
  javaPart_ = nullptr;
}

} // namespace rnscreens
