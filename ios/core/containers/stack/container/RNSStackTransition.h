#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

/**
 * Kind of the visible transition between two stacks, decided by the top of the stack only (RFC-1941, "Visible
 * transition"). Changes below the top are applied without animation as part of the same transition.
 */
typedef NS_ENUM(NSInteger, RNSStackTransitionKind) {
  /**
   * The top stays the same, e.g. a removal from the middle.
   */
  RNSStackTransitionKindNone = 0,
  /**
   * The new top was already in the stack: pop, multi-pop, pop-to.
   */
  RNSStackTransitionKindPop,
  /**
   * The new top was not in the stack and the old top stays in it: push, multi-push.
   */
  RNSStackTransitionKindPush,
  /**
   * The new top was not in the stack and the old top leaves it: replace, reset.
   */
  RNSStackTransitionKindReplace,
};

/**
 * A transition of the stack the container hands to UIKit: its kind and the screens involved.
 */
@interface RNSStackTransition : NSObject

@property (nonatomic, readonly) RNSStackTransitionKind kind;

/**
 * Screens in the stack before the transition, bottom to top.
 */
@property (nonatomic, copy, readonly) NSArray<RNSStackScreenController *> *fromStack;

/**
 * Screens in the stack after the transition, bottom to top.
 */
@property (nonatomic, copy, readonly) NSArray<RNSStackScreenController *> *toStack;

/**
 * Top of `fromStack`, nil if it is empty.
 */
@property (nonatomic, readonly, nullable) RNSStackScreenController *fromScreen;

/**
 * Top of `toStack`, nil if it is empty.
 */
@property (nonatomic, readonly, nullable) RNSStackScreenController *toScreen;

/**
 * Whether the transition is driven by a gesture (swipe back), so it may still be cancelled.
 */
@property (nonatomic, readonly) BOOL isInteractive;

- (instancetype)initFromStack:(NSArray<RNSStackScreenController *> *)fromStack
                      toStack:(NSArray<RNSStackScreenController *> *)toStack
                  interactive:(BOOL)interactive;

/**
 * Applies the top-of-stack rule. Both stacks have pairwise distinct elements.
 */
+ (RNSStackTransitionKind)kindOfTransitionFromStack:(NSArray<RNSStackScreenController *> *)fromStack
                                            toStack:(NSArray<RNSStackScreenController *> *)toStack;

@end

NS_ASSUME_NONNULL_END
