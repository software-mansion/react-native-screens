#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSContainedModalPresentationState) {
  RNSContainedModalPresentationStateDismissed,
  RNSContainedModalPresentationStateDismissing,
  RNSContainedModalPresentationStatePresented,
  RNSContainedModalPresentationStatePresenting
};
