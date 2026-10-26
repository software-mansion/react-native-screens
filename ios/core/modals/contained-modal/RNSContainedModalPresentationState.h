#pragma once

#import <Foundation/Foundation.h>

/**
 * There is no `Presenting` state on purpose. The present completion carries no
 * signal: UIKit may defer the request past a parent transition and perform it
 * later without ever calling the completion, or drop it silently. A stored
 * in-flight state would therefore have no reliable exit edge, and every
 * failure mode of one is a modal stuck in it. The manager stays `Dismissed`
 * until the content controller's `viewDidAppear` stamps `Presented`;
 * `presentedViewController == controller` makes a retried request idempotent
 * meanwhile, and `controller.isBeingPresented` is the derived in-flight
 * signal if one is ever needed.
 *
 * The dismiss completion is reliable, so `Dismissing` exists.
 */
typedef NS_ENUM(NSInteger, RNSContainedModalPresentationState) {
  RNSContainedModalPresentationStateDismissed,
  RNSContainedModalPresentationStateDismissing,
  RNSContainedModalPresentationStatePresented
};
