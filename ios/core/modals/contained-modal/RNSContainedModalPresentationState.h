#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSContainedModalPresentationState) {
  RNSContainedModalPresentationStateDismissed,
  RNSContainedModalPresentationStateDismissing,
  // There is no `Presenting` state on purpose. The present completion carries no
  // signal: UIKit may defer the request past a parent transition and perform it
  // later without ever calling the completion, or drop it silently.
  RNSContainedModalPresentationStatePresented
};

/// What the presentation manager does with a presentation request.
typedef NS_ENUM(NSInteger, RNSContainedModalPresentationDecision) {
  RNSContainedModalPresentationDecisionPresent,
  /// Keep the request pending; a later update re-evaluates it.
  RNSContainedModalPresentationDecisionDefer,
  /// Drop the request and notify the delegate; only a new `isOpen` retries.
  RNSContainedModalPresentationDecisionReject,
};
