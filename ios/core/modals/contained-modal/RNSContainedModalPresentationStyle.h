#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSContainedModalPresentationStyle) {
  /// `UIModalPresentationOverCurrentContext`: the provider's content stays in
  /// place underneath the modal.
  RNSContainedModalPresentationStyleOverContent,
  /// `UIModalPresentationCurrentContext`: UIKit removes the provider's content
  /// view from the hierarchy for the duration of the presentation and restores
  /// it on dismissal.
  RNSContainedModalPresentationStyleReplacingContent,
};
