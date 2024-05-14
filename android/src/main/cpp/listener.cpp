#include <react/renderer/mounting/ShadowViewMutation.h>
#include "listener.h"
using namespace facebook::react;

std::optional<MountingTransaction> LayoutAnimationsProxy::pullTransaction(
        SurfaceId surfaceId,
        MountingTransaction::Number transactionNumber,
        const TransactionTelemetry &telemetry,
        ShadowViewMutationList mutations) const {

    for (ShadowViewMutation mutation : mutations) {
        if (mutation.type == ShadowViewMutation::Type::Remove && mutation.oldChildShadowView.componentName !=
                                                                         nullptr &&
            strcmp(mutation.oldChildShadowView.componentName, "RNSScreen") == 0) {
            listenerFunction_(mutation.oldChildShadowView.tag);
        }
    }

    return MountingTransaction{surfaceId, transactionNumber, std::move(mutations), telemetry};
}

bool LayoutAnimationsProxy::shouldOverridePullTransaction() const {
    return true;
}
