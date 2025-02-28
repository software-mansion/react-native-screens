#include "RNSScreenRemovalListener.h"
#include <react/renderer/mounting/ShadowViewMutation.h>
using namespace facebook::react;

std::optional<MountingTransaction> RNSScreenRemovalListener::pullTransaction(
    SurfaceId surfaceId,
    MountingTransaction::Number transactionNumber,
    const TransactionTelemetry &telemetry,
    ShadowViewMutationList mutations) const {
  for (const ShadowViewMutation &mutation : mutations) {
    if (mutation.type == ShadowViewMutation::Type::Remove &&
        mutation.oldChildShadowView.componentName != nullptr &&
        strcmp(mutation.oldChildShadowView.componentName, "RNSScreen") == 0) {
      // We call the listener function even if this screen has not been owned
      // by RNSScreenStack as since RN 0.78 we do not have enough information
      // here. This final filter is applied later in NativeProxy.
      listenerFunction_(mutation.oldChildShadowView.tag);
    }
  }

  return MountingTransaction{
      surfaceId, transactionNumber, std::move(mutations), telemetry};
}

bool RNSScreenRemovalListener::shouldOverridePullTransaction() const {
  return true;
}
