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

  // RN core lacks a `removeMountingOverrideDelegate` API, so this instance is
  // process-immortal and swaps its callback instead of being replaced. The
  // ownership token keeps a stale proxy's teardown from clearing a newer
  // proxy's listener.
  // See https://github.com/software-mansion/react-native-screens/pull/4413
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
