#pragma once

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNSFullScreenModalPresentationStyle) {
  /// `UIModalPresentationFullScreen`: UIKit removes the presenter's views from the window while the modal is shown.
  RNSFullScreenModalPresentationStyleReplacingContent,
  /// `UIModalPresentationOverFullScreen`: the presenter's views stay in the window underneath the modal.
  RNSFullScreenModalPresentationStyleOverContent,
};
