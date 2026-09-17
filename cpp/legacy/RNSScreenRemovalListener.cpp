#include "RNSScreenRemovalListener.h"
#include <react/renderer/mounting/ShadowViewMutation.h>
#include <algorithm>
#include <cstring>
#include <unordered_set>
#include <utility>
using namespace facebook::react;

namespace {

bool isScreenComponent(const ShadowView &shadowView) {
  return shadowView.componentName != nullptr &&
      (std::strcmp(shadowView.componentName, "RNSScreen") == 0 ||
       std::strcmp(shadowView.componentName, "RNSModalScreen") == 0);
}

bool isScreenDelete(const ShadowViewMutation &mutation) {
  return mutation.type == ShadowViewMutation::Type::Delete &&
      isScreenComponent(mutation.oldChildShadowView);
}

} // namespace

uint64_t RNSScreenRemovalListener::setListener(
    std::function<void(int)> &&listenerFunction) {
  std::lock_guard<std::mutex> lock(listenerMutex_);
  listenerFunction_ = std::move(listenerFunction);
  return ++currentToken_;
}

void RNSScreenRemovalListener::clearListener(uint64_t token) {
  std::lock_guard<std::mutex> lock(listenerMutex_);
  if (token == currentToken_) {
    listenerFunction_ = nullptr;
  }
}

std::optional<MountingTransaction> RNSScreenRemovalListener::pullTransaction(
    SurfaceId surfaceId,
    MountingTransaction::Number transactionNumber,
    const TransactionTelemetry &telemetry,
    ShadowViewMutationList mutations) const {
  // Copy under the lock, invoke outside it: the callback makes a JNI call and
  // must not run while holding a lock the module thread also takes.
  std::function<void(int)> listener;
  {
    std::lock_guard<std::mutex> lock(listenerMutex_);
    listener = listenerFunction_;
  }

  if (!listener) {
    // Orphaned between module teardown and the next install: pass the
    // transaction through untouched.
    return MountingTransaction{
        surfaceId, transactionNumber, std::move(mutations), telemetry};
  }

  // This runs for every transaction; almost none of them delete a screen, so
  // detect that cheaply before allocating any lookup state.
  const bool deletesAnyScreen =
      std::any_of(mutations.begin(), mutations.end(), isScreenDelete);

  if (deletesAnyScreen) {
    // A Remove without a matching Delete is a reorder within the parent, not
    // a dismissal, and must not trigger removal handling. A false positive
    // here makes NativeProxy pin a snapshot overlay on a live screen, and
    // nothing ever clears it.
    std::unordered_set<Tag> deletedScreenTags{};
    for (const ShadowViewMutation &mutation : mutations) {
      if (isScreenDelete(mutation)) {
        deletedScreenTags.insert(mutation.oldChildShadowView.tag);
      }
    }

    for (const ShadowViewMutation &mutation : mutations) {
      if (mutation.type == ShadowViewMutation::Type::Remove &&
          isScreenComponent(mutation.oldChildShadowView) &&
          deletedScreenTags.count(mutation.oldChildShadowView.tag) > 0) {
        // We call the listener function even if this screen has not been owned
        // by RNSScreenStack as since RN 0.78 we do not have enough information
        // here. This final filter is applied later in NativeProxy.
        listener(mutation.oldChildShadowView.tag);
      }
    }
  }

  return MountingTransaction{
      surfaceId, transactionNumber, std::move(mutations), telemetry};
}

bool RNSScreenRemovalListener::shouldOverridePullTransaction() const {
  return true;
}
