#include "RNSScreenRemovalListener.h"
#include <react/renderer/mounting/ShadowViewMutation.h>
#include <unordered_set>
using namespace facebook::react;

namespace {

bool isRNSScreen(const ShadowView &shadowView) {
  return shadowView.componentName != nullptr &&
      std::strcmp(shadowView.componentName, "RNSScreen") == 0;
}

} // namespace

std::optional<MountingTransaction> RNSScreenRemovalListener::pullTransaction(
    SurfaceId surfaceId,
    MountingTransaction::Number transactionNumber,
    const TransactionTelemetry &telemetry,
    ShadowViewMutationList mutations) const {
  std::unordered_set<Tag> insertedScreenTags;
  for (const ShadowViewMutation &mutation : mutations) {
    if (mutation.type == ShadowViewMutation::Type::Insert &&
        isRNSScreen(mutation.newChildShadowView)) {
      insertedScreenTags.insert(mutation.newChildShadowView.tag);
    }
  }

  for (const ShadowViewMutation &mutation : mutations) {
    // When using RNSModalScreen on Android it should be added here.
    if (mutation.type == ShadowViewMutation::Type::Remove &&
        isRNSScreen(mutation.oldChildShadowView) &&
        insertedScreenTags.find(mutation.oldChildShadowView.tag) ==
            insertedScreenTags.end()) {
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
