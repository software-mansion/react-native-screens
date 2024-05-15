#include "listener.h"
#include <react/renderer/mounting/ShadowViewMutation.h>
using namespace facebook::react;

std::optional<MountingTransaction> LayoutAnimationsProxy::pullTransaction(
    SurfaceId surfaceId,
    MountingTransaction::Number transactionNumber,
    const TransactionTelemetry &telemetry,
    ShadowViewMutationList mutations) const {
  for (ShadowViewMutation mutation : mutations) {
    if (mutation.type == ShadowViewMutation::Type::Remove &&
        mutation.parentShadowView.componentName != nil &&
        strcmp(mutation.parentShadowView.componentName, "RNSScreenStack") ==
            0) {
      listenerFunction_(mutation.parentShadowView.tag);
    }
  }

  return MountingTransaction{
      surfaceId, transactionNumber, std::move(mutations), telemetry};
}

bool LayoutAnimationsProxy::shouldOverridePullTransaction() const {
  return true;
}
