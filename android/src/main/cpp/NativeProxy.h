#pragma once

#include <fbjni/fbjni.h>
#include <react/fabric/JFabricUIManager.h>
#include "RNSScreenRemovalListener.h"

#include <string>

namespace rnscreens {
using namespace facebook;
using namespace facebook::jni;

struct WeakMountingCoordinatorPtrHash {
  std::size_t operator()(
      const std::weak_ptr<const facebook::react::MountingCoordinator> &ptr)
      const {
    if (auto sp = ptr.lock()) {
      return std::hash<const void *>()(sp.get());
    }
    return 0;
  }
};

struct WeakMountingCoordinatorPtrEqual {
  bool operator()(
      const std::weak_ptr<const facebook::react::MountingCoordinator> &a,
      const std::weak_ptr<const facebook::react::MountingCoordinator> &b)
      const {
    return a.lock() == b.lock();
  }
};

class NativeProxy : public jni::HybridClass<NativeProxy> {
 public:
  std::shared_ptr<RNSScreenRemovalListener> screenRemovalListener_;
  std::unordered_set<
      std::weak_ptr<const facebook::react::MountingCoordinator>,
      WeakMountingCoordinatorPtrHash,
      WeakMountingCoordinatorPtrEqual>
      coordinatorsWithMountingOverrides_;
  static auto constexpr kJavaDescriptor =
      "Lcom/swmansion/rnscreens/NativeProxy;";
  static jni::local_ref<jhybriddata> initHybrid(
      jni::alias_ref<jhybridobject> jThis);
  static void registerNatives();

 private:
  friend HybridBase;
  jni::global_ref<NativeProxy::javaobject> javaPart_;

  explicit NativeProxy(jni::alias_ref<NativeProxy::javaobject> jThis);

  void nativeAddMutationsListener(
      jni::alias_ref<facebook::react::JFabricUIManager::javaobject>
          fabricUIManager);

  void invalidateNative();
};

} // namespace rnscreens
