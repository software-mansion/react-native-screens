#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSFullScreenModalAnimation) {
  RNSFullScreenModalAnimationDefault,
  RNSFullScreenModalAnimationNone,
  RNSFullScreenModalAnimationCoverVertical,
  RNSFullScreenModalAnimationCrossDissolve,
  /// Falls back to `Default` on tvOS, where UIKit does not offer it.
  RNSFullScreenModalAnimationFlipHorizontal,
};
