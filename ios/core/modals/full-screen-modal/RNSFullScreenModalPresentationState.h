#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSFullScreenModalPresentationState) {
  RNSFullScreenModalPresentationStateDismissed,
  RNSFullScreenModalPresentationStateDismissing,
  // There is no `Presenting` state on purpose. The present completion carries no
  // signal: UIKit may defer the request past an in-flight transition and perform
  // it later without ever calling the completion, or drop it silently.
  RNSFullScreenModalPresentationStatePresented
};
