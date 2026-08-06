#pragma once

#include <fbjni/fbjni.h>
#include <react/fabric/JFabricUIManager.h>
#include "RNSScreenRemovalListener.h"

#include <cstdint>
#include <mutex>
#include <string>

namespace rnscreens {
using namespace facebook;
using namespace facebook::jni;

class NativeProxy : public jni::HybridClass<NativeProxy> {
 public:
  std::vector<std::weak_ptr<const facebook::react::MountingCoordinator>>
      coordinatorsWithMountingOverrides_;
  // Guarded by installMutex_ (serializes listener install vs invalidateNative).
  uint64_t removalListenerToken_{0};
  static auto constexpr kJavaDescriptor =
      "Lcom/swmansion/rnscreens/NativeProxy;";
  static jni::local_ref<jhybriddata> initHybrid(
      jni::alias_ref<jhybridobject> jThis);
  static void registerNatives();

 private:
  friend HybridBase;
  jni::global_ref<NativeProxy::javaobject> javaPart_;

  std::mutex coordinatorsMutex_;

  // Serializes callback install (nativeAddMutationsListener) with
  // invalidateNative: the install-time copy of javaPart_ must not race the
  // invalidation write, and the stored token must match the last install.
  std::mutex installMutex_;

  explicit NativeProxy(jni::alias_ref<NativeProxy::javaobject> jThis);

  void nativeAddMutationsListener(
      jni::alias_ref<facebook::react::JFabricUIManager::javaobject>
          fabricUIManager);

  void invalidateNative();

  void cleanupExpiredMountingCoordinators();
  void addMountingCoordinatorIfNeeded(
      const std::shared_ptr<const facebook::react::MountingCoordinator>
          &coordinator);
};

} // namespace rnscreens
