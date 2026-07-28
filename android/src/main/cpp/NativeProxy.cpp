#include <fbjni/fbjni.h>
#include <react/fabric/Binding.h>
#include <react/renderer/scheduler/Scheduler.h>

#include <memory>
#include <string>

#include "NativeProxy.h"

using namespace facebook;
using namespace react;

namespace rnscreens {

namespace {
// Process-lifetime owner. MountingCoordinator::mountingOverrideDelegates_ is
// append-only with no removal API in react-native core (as of 0.87), so a
// listener that is destroyed (here: by Java GC finalizing the NativeProxy
// hybrid) leaves a stale weak_ptr that can still be locked and
// virtual-dispatched from MountingCoordinator::pullTransaction on the JS
// thread -> SIGSEGV.
// Function-local static: thread-safe init, no static-init-order dependency.
const std::shared_ptr<RNSScreenRemovalListener> &removalListener() {
  static const std::shared_ptr<RNSScreenRemovalListener> instance =
      std::make_shared<RNSScreenRemovalListener>();
  return instance;
}
} // namespace

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

  // Capture a copy of the global ref, never `this`: the listener outlives this
  // NativeProxy, which Java GC destroys on the finalizer thread.
  removalListenerToken_ =
      removalListener()->setListener([javaPart = javaPart_](int tag) {
        static const auto method =
            javaPart->getClass()->getMethod<void(jint)>("notifyScreenRemoved");
        method(javaPart, tag);
      });

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
    coordinator->setMountingOverrideDelegate(removalListener());
    coordinatorsWithMountingOverrides_.push_back(coordinator);
  }
}

jni::local_ref<NativeProxy::jhybriddata> NativeProxy::initHybrid(
    jni::alias_ref<jhybridobject> jThis) {
  return makeCxxInstance(jThis);
}

void NativeProxy::invalidateNative() {
  // Disarm before the hybrid is collected; also releases the captured global
  // ref so the Java NativeProxy stays collectable.
  removalListener()->clearListener(removalListenerToken_);
  javaPart_ = nullptr;
}

} // namespace rnscreens
