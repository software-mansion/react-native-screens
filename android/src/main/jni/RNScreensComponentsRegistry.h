#pragma once

#include <ComponentFactory.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/componentregistry/ComponentDescriptorRegistry.h>

namespace facebook {
namespace react {

class RNScreensComponentsRegistry
    : public facebook::jni::HybridClass<RNScreensComponentsRegistry> {
 public:
  constexpr static auto kJavaDescriptor =
      "Lcom/swmansion/rnscreens/RNScreensComponentsRegistry;";

  static void registerNatives();

  RNScreensComponentsRegistry(ComponentFactory *delegate);

 private:
  friend HybridBase;

  static std::shared_ptr<ComponentDescriptorProviderRegistry const> sharedProviderRegistry();

  const ComponentFactory *delegate_;

  static jni::local_ref<jhybriddata> initHybrid(
      jni::alias_ref<jclass>,
      ComponentFactory *delegate);
};

} // namespace react
} // namespace facebook
