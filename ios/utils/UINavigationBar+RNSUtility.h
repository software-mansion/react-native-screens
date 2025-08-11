#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UINavigationBar (RNSUtility)

/**
 * Aims to find main content view of the `UINavigationBar`.
 *
 * This method relies on internal iOS implementation details (see the implementation)
 * and might need patches specific to future iOS versions, in case the view hierarchy inside
 * the navigation bar changes.
 *
 * Tested to work reliably on iOS 18.0, 17.5, 15.5.
 *
 * @returns `_UINavigationBarContentView` view mounted directly under the navigation bar itself
 */
- (nullable UIView *)rnscreens_findContentView;

/**
 * Aims to find the back button wrapper view of the `UINavigationBar`. This is the view that contains
 * the back button itself alongside all the margin / padding used to position the back button by the system.
 *
 * This method relies on internal iOS implementation details (see the implementation)
 * and might need patches specific to future iOS versions, in case the view hierarchy inside
 * the navigation bar changes.
 *
 * Tested to work reliably on iOS 18.0, 17.5, 15.5.
 *
 * @returns `_UIButtonBarButton` view, if present and mounted in anticipated place;
 *                      if the back button is not present, this method returns `nil`.
 */
- (nullable UIView *)rnscreens_findBackButtonWrapperView;

/**
 * @brief Responsible for calculating the cumulative directional layout margins the will be applied to the title in the
 * header.
 *
 * The method depends on private UIKit internals, such as the presence of `_UINavigationBarTitleControll`
 * If the title control is not found in the UINavigationBar view hierarchy, the method logs a warning
 * and returns zeroed margins.
 *
 * Tested to work reliably on iOS 26.0, 18.5.
 *
 * @returns NSDirectionalEdgeInsets containing the combined layout margins from the title control
 * up to its ancestor navigation bar.
 */
- (NSDirectionalEdgeInsets)rnscreens_sumTitleControlDirectionalMargins;

@end

NS_ASSUME_NONNULL_END
