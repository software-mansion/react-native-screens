#pragma once

#include <fbjni/fbjni.h>
#include <react/fabric/JFabricUIManager.h>
#include "RNSScreenRemovalListener.h"

#include <mutex>
#include <string>

namespace rnscreens {
using namespace facebook;
using namespace facebook::jni;

class NativeProxy : public jni::HybridClass<NativeProxy> {
 public:
  std::shared_ptr<RNSScreenRemovalListener> screenRemovalListener_;
  std::vector<std::weak_ptr<const facebook::react::MountingCoordinator>>
      coordinatorsWithMountingOverrides_;
  static auto constexpr kJavaDescriptor =
      "Lcom/swmansion/rnscreens/NativeProxy;";
  static jni::local_ref<jhybriddata> initHybrid(
      jni::alias_ref<jhybridobject> jThis);
  static void registerNatives();

 private:
  friend HybridBase;
  jni::global_ref<NativeProxy::javaobject> javaPart_;

  std::mutex coordinatorsMutex_;

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
