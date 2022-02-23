#include "RNScreensComponentsRegistry.h"

#include <CoreComponentsRegistry.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/components/rnscreens/ComponentDescriptors.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#include <rnscreens/RNSScreenComponentDescriptor.h>

namespace facebook {
namespace react {

RNScreensComponentsRegistry::RNScreensComponentsRegistry(
    ComponentFactory *delegate)
    : delegate_(delegate) {}

std::shared_ptr<ComponentDescriptorProviderRegistry const>
RNScreensComponentsRegistry::sharedProviderRegistry() {
  auto providerRegistry = CoreComponentsRegistry::sharedProviderRegistry();

  // Screens
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackHeaderConfigComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackHeaderSubviewComponentDescriptor>());

  return providerRegistry;
}

jni::local_ref<RNScreensComponentsRegistry::jhybriddata>
RNScreensComponentsRegistry::initHybrid(
    jni::alias_ref<jclass>,
    ComponentFactory *delegate) {
  auto instance = makeCxxInstance(delegate);

  auto buildRegistryFunction =
      [](EventDispatcher::Weak const &eventDispatcher,
         ContextContainer::Shared const &contextContainer)
      -> ComponentDescriptorRegistry::Shared {
    auto registry = RNScreensComponentsRegistry::sharedProviderRegistry()
                        ->createComponentDescriptorRegistry(
                            {eventDispatcher, contextContainer});

    return registry;
  };

  delegate->buildRegistryFunction = buildRegistryFunction;
  return instance;
}

void RNScreensComponentsRegistry::registerNatives() {
  registerHybrid({
      makeNativeMethod("initHybrid", RNScreensComponentsRegistry::initHybrid),
  });
  // This is a temporary solution that allows components exported by the screens
  // library to be added to the main component registry. This code is triggered
  // when c++ screens library is initialized and is needed because RN's autolinking
  // does not currently support Fabric components. As a consequence, users would need
  // to manually put library initialization calls in their ReactNativeHost implementation
  // which is undesirable.
  sharedProviderRegistry();
}

} // namespace react
} // namespace facebook
