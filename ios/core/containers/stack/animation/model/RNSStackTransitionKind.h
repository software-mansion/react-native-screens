#pragma once

#import <Foundation/Foundation.h>

/**
 * The two transitions every animation defines: the one played when the screen is pushed and the one played when it
 * is popped.
 */
typedef NS_ENUM(NSInteger, RNSStackTransitionKind) {
  RNSStackTransitionKindPush,
  RNSStackTransitionKindPop,
};
