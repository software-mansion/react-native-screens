/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "RNScreensComponentRegistry.h"

#include <CoreComponentsRegistry.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/components/rnscreens/ComponentDescriptors.h>
#include <react/renderer/mapbuffer/MapBuffer.h>
#include <react/renderer/mapbuffer/MapBufferBuilder.h>
#include <rnscreens/RNSScreenComponentDescriptor.h>

namespace facebook {
namespace react {

RNScreensComponentRegistry::RNScreensComponentRegistry(
    ComponentFactory *delegate)
    : delegate_(delegate) {}

std::shared_ptr<ComponentDescriptorProviderRegistry const>
RNScreensComponentRegistry::sharedProviderRegistry() {
  auto providerRegistry = CoreComponentsRegistry::sharedProviderRegistry();

  // Screens
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackHeaderConfigComponentDescriptor>());
  providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackHeaderSubviewComponentDescriptor>());

  return providerRegistry;
}

jni::local_ref<RNScreensComponentRegistry::jhybriddata>
RNScreensComponentRegistry::initHybrid(
    jni::alias_ref<jclass>,
    ComponentFactory *delegate) {
  auto instance = makeCxxInstance(delegate);

  auto buildRegistryFunction =
      [](EventDispatcher::Weak const &eventDispatcher,
         ContextContainer::Shared const &contextContainer)
      -> ComponentDescriptorRegistry::Shared {
    auto registry = RNScreensComponentRegistry::sharedProviderRegistry()
                        ->createComponentDescriptorRegistry(
                            {eventDispatcher, contextContainer});

    return registry;
  };

  delegate->buildRegistryFunction = buildRegistryFunction;
  return instance;
}

void RNScreensComponentRegistry::registerNatives() {
  registerHybrid({
      makeNativeMethod("initHybrid", RNScreensComponentRegistry::initHybrid),
  });
}

} // namespace react
} // namespace facebook
