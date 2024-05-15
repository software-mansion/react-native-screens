#pragma once

#include <react/renderer/componentregistry/ComponentDescriptorFactory.h>
#include <react/renderer/mounting/MountingOverrideDelegate.h>
#include <react/renderer/mounting/ShadowView.h>

using namespace facebook::react;

struct LayoutAnimationsProxy : public MountingOverrideDelegate {
  std::function<void(int)> listenerFunction_;
  LayoutAnimationsProxy(std::function<void(int)> &&listenerFunction_)
      : listenerFunction_(listenerFunction_) {}

  bool shouldOverridePullTransaction() const override;
  std::optional<MountingTransaction> pullTransaction(
      SurfaceId surfaceId,
      MountingTransaction::Number number,
      const TransactionTelemetry &telemetry,
      ShadowViewMutationList mutations) const override;
};
