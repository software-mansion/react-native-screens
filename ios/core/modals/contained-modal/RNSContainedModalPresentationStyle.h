#pragma once

#import <Foundation/Foundation.h>

/**
 * How a contained modal relates to its provider's content while presented.
 * Maps 1:1 onto the native context presentation styles; kept as a separate
 * type so the React layer never hands UIKit enums into core.
 */
typedef NS_ENUM(NSInteger, RNSContainedModalPresentationStyle) {
  /// `UIModalPresentationOverCurrentContext`: the provider's content stays in
  /// place underneath the modal.
  RNSContainedModalPresentationStyleOverContent,
  /// `UIModalPresentationCurrentContext`: UIKit removes the provider's content
  /// view from the hierarchy for the duration of the presentation and restores
  /// it on dismissal.
  RNSContainedModalPresentationStyleReplacingContent,
};
