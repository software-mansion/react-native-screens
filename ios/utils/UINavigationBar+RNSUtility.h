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
 * This method traverses the superview hierarchy, starting from the parent of the specified source view,
 * and accumulates all `directionalLayoutMargins` until it reaches the `UINavigationBar`.
 * The resulting insets represent the total margin space between the source view and its navigation container.
 *
 * Tested to work reliably on iOS 26.0, 18.5.
 *
 * @param sourceView The UIView from which to begin traversing up towards the navigation bar.
 * @returns NSDirectionalEdgeInsets containing the combined layout margins from the title control
 * up to its ancestor navigation bar.
 */
- (NSDirectionalEdgeInsets)rnscreens_computeTotalEdgeInsetsForView:(nullable UIView *)sourceView;

/**
 * @brief Responsible for searching the view hierarchy to locate the `_UINavigationBarTitleControl` view.
 *
 * This method traverses a subtree from given view, to find  `_UINavigationBarTitleControl`.
 * `_UINavigationBarTitleControl` is a private API. Therefore, this method relies on the
 * hardcoded class name which may change at any time.
 *
 * The method performs a DFS starting from the provided view.
 * Once a matching title control is found, it is returned immediately. If not found,
 * the method returns nil.
 *
 * Tested to work reliably on iOS 26.0, 18.5.
 *
 * @param view The root UIView from which to begin searching the view hierarchy.
 * @return A UIView instance representing the `_UINavigationBarTitleControl` or `nil`.
 */
+ (UIView *)findTitleControlInView:(UIView *)view;

@end

NS_ASSUME_NONNULL_END
