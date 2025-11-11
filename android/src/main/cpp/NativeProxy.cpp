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
       makeNativeMethod(
           "cleanupExpiredMountingCoordinators",
           NativeProxy::cleanupExpiredMountingCoordinators),
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

  cleanupExpiredMountingCoordinators();

  uiManager->getShadowTreeRegistry().enumerate(
      [this](const facebook::react::ShadowTree &shadowTree, bool &stop) {
        if (auto coordinator = shadowTree.getMountingCoordinator()) {
          addMountingCoordinatorIfNeeded(coordinator);
        }
      });
}

void NativeProxy::cleanupExpiredMountingCoordinators() {
  std::lock_guard<std::mutex> lock(coordinatorsMutex_);

  coordinatorsWithMountingOverrides_.erase(
      std::remove_if(
          coordinatorsWithMountingOverrides_.begin(),
          coordinatorsWithMountingOverrides_.end(),
          [](const std::weak_ptr<const facebook::react::MountingCoordinator>
                 &weakPtr) { return weakPtr.expired(); }),
      coordinatorsWithMountingOverrides_.end());
}

void NativeProxy::addMountingCoordinatorIfNeeded(
    const std::shared_ptr<const facebook::react::MountingCoordinator>
        &coordinator) {
  std::lock_guard<std::mutex> lock(coordinatorsMutex_);

  bool wasRegistered = std::ranges::any_of(
      coordinatorsWithMountingOverrides_,
      [&coordinator](
          const std::weak_ptr<const facebook::react::MountingCoordinator>
              &weakPtr) {
        auto existing = weakPtr.lock();
        return existing && existing.get() == coordinator.get();
      });

  if (!wasRegistered) {
    coordinator->setMountingOverrideDelegate(screenRemovalListener_);
    coordinatorsWithMountingOverrides_.push_back(coordinator);
  }
}

jni::local_ref<NativeProxy::jhybriddata> NativeProxy::initHybrid(
    jni::alias_ref<jhybridobject> jThis) {
  return makeCxxInstance(jThis);
}

void NativeProxy::invalidateNative() {
  javaPart_ = nullptr;
}

} // namespace rnscreens
