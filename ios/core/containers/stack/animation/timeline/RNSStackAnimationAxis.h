#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSStackAnimationAxis) {
  RNSStackAnimationAxisX,
  RNSStackAnimationAxisY,
  /**
   * X that mirrors in a right-to-left container: positive values move toward the trailing edge.
   */
  RNSStackAnimationAxisLogicalX,
};
