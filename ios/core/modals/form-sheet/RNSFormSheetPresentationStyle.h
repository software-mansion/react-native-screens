#pragma once

#import <Foundation/Foundation.h>

/// UIKit presentation style a sheet content controller presents with. Both styles are backed by
/// `UISheetPresentationController`, so the whole sheet configuration (detents, grabber, corner radius, ...) applies to
/// either; they differ only in the layout UIKit picks in regular-width environments (iPad).
/// Availability: page sheet is unavailable on tvOS, form sheet requires tvOS 26; see
/// `-[RNSFormSheetContentController isPresentationStyleAvailable]`.
typedef NS_ENUM(NSInteger, RNSFormSheetPresentationStyle) {
  /// `UIModalPresentationFormSheet`: a centered panel of a fixed size on iPad.
  RNSFormSheetPresentationStyleFormSheet,
  /// `UIModalPresentationPageSheet`: a wide, bottom-anchored card on iPad; the presenter recedes behind it.
  RNSFormSheetPresentationStylePageSheet,
};

/// Human-readable name of the style, for diagnostics.
static inline NSString *RNSFormSheetPresentationStyleName(RNSFormSheetPresentationStyle style)
{
  switch (style) {
    case RNSFormSheetPresentationStylePageSheet:
      return @"pageSheet";
    case RNSFormSheetPresentationStyleFormSheet:
    default:
      return @"formSheet";
  }
}
