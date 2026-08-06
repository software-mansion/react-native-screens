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
// Process-lifetime owner. Two threads can reach nativeAddMutationsListener
// concurrently on a cold launch: ScreensModule.initialize() on the module-init
// thread, and onHostResume() on the UI thread (queued before setupFabric()
// returns). The previous lazy `if (!screenRemovalListener_)` init raced there:
// concurrent shared_ptr assignments are UB and can leave the registered
// delegate pointing at freed memory while its control block still reports it
// alive, so the next MountingCoordinator::pullTransaction locks the weak_ptr
// successfully and virtual-calls into recycled heap -> SIGSEGV.
// A function-local static leaves nothing to race (thread-safe init, no
// static-init-order dependency), and a process-immortal instance also suits
// core's delegate list, which is append-only with no removal API (as of 0.87).
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

  {
    // Capture a copy of the global ref, never `this`: the listener outlives
    // this NativeProxy, and the old live read of javaPart_ at call time raced
    // invalidateNative(). installMutex_ keeps the copy from racing the
    // invalidation write and keeps the stored token matching the last install.
    std::lock_guard<std::mutex> lock(installMutex_);
    removalListenerToken_ =
        removalListener()->setListener([javaPart = javaPart_](int tag) {
          static const auto method =
              javaPart->getClass()->getMethod<void(jint)>(
                  "notifyScreenRemoved");
          method(javaPart, tag);
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
  // ref so the Java NativeProxy stays collectable. Serialized with the install
  // path so the token is never stale and javaPart_ is not nulled mid-capture.
  std::lock_guard<std::mutex> lock(installMutex_);
  removalListener()->clearListener(removalListenerToken_);
  javaPart_ = nullptr;
}

} // namespace rnscreens
