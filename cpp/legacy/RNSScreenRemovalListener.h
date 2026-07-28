#pragma once

#include <react/renderer/componentregistry/ComponentDescriptorFactory.h>
#include <react/renderer/mounting/MountingOverrideDelegate.h>
#include <react/renderer/mounting/ShadowView.h>

#include <cstdint>
#include <functional>
#include <mutex>

using namespace facebook::react;

struct RNSScreenRemovalListener : public MountingOverrideDelegate {
  RNSScreenRemovalListener() = default;

  // This instance is process-immortal (see NativeProxy.cpp): MountingCoordinator
  // keeps a weak_ptr to it for the lifetime of every surface and react-native
  // core has no removeMountingOverrideDelegate (as of 0.87), so destroying it
  // leaves an entry that can still be locked and virtual-dispatched. Swap the
  // callback instead.
  // setListener returns an ownership token; clearListener is a no-op unless the token
  // matches the latest install, so a stale proxy's teardown (second ReactHost, late
  // finalization) cannot disarm the callback a newer proxy installed.
  uint64_t setListener(std::function<void(int)> &&listenerFunction);
  void clearListener(uint64_t token);

  bool shouldOverridePullTransaction() const override;
  std::optional<MountingTransaction> pullTransaction(
      SurfaceId surfaceId,
      MountingTransaction::Number number,
      const TransactionTelemetry &telemetry,
      ShadowViewMutationList mutations) const override;

 private:
  mutable std::mutex listenerMutex_;
  std::function<void(int)> listenerFunction_;
  uint64_t currentToken_{0};
};
