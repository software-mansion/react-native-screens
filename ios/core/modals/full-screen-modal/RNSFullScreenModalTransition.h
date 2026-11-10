#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSFullScreenModalTransition) {
  RNSFullScreenModalTransitionAutomatic,
  RNSFullScreenModalTransitionFade,
  /// Falls back to `Automatic` on tvOS, where UIKit does not offer it.
  RNSFullScreenModalTransitionFlip,
  RNSFullScreenModalTransitionNone,
};
