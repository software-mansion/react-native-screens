#pragma once

#import <Foundation/Foundation.h>

/// UIKit presentation style a sheet content controller presents with. Both styles are backed by
/// `UISheetPresentationController`, so the whole sheet configuration (detents, grabber, corner radius, ...) applies to
/// either; they differ only in the layout UIKit picks in regular-width environments (iPad).
/// Availability: page sheet is unavailable on tvOS, form sheet requires tvOS 26; see
/// `-[RNSSheetContentController isPresentationStyleAvailable]`.
typedef NS_ENUM(NSInteger, RNSSheetPresentationStyle) {
  /// `UIModalPresentationFormSheet`: a centered panel of a fixed size on iPad.
  RNSSheetPresentationStyleFormSheet,
  /// `UIModalPresentationPageSheet`: a wide, bottom-anchored card on iPad; the presenter recedes behind it.
  RNSSheetPresentationStylePageSheet,
};

/// Human-readable name of the style, for diagnostics.
static inline NSString *RNSSheetPresentationStyleName(RNSSheetPresentationStyle style)
{
  switch (style) {
    case RNSSheetPresentationStylePageSheet:
      return @"pageSheet";
    case RNSSheetPresentationStyleFormSheet:
    default:
      return @"formSheet";
  }
}
