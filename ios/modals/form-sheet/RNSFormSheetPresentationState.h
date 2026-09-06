#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSFormSheetPresentationState) {
  RNSFormSheetPresentationStateDismissed,
  RNSFormSheetPresentationStateDismissing,
  RNSFormSheetPresentationStatePresented,
  RNSFormSheetPresentationStatePresenting
};
