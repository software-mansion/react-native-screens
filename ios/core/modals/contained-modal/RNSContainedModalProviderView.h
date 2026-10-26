#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainedModalProviderController.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Owns the presentation context of a contained modal: the context controller
 * and its view, which is this view's direct, exactly-filling subview for the
 * whole lifetime. It is inserted below every other subview and never removed.
 *
 * UIKit attaches its presentation container to the context view's superview,
 * sized to that superview's bounds with a flexible autoresizing mask (observed,
 * undocumented behavior), and the container swallows every direct touch inside
 * its bounds. Keeping that superview here, under this view's sole ownership,
 *  - scopes the modal's touch blocking exactly to the provider,
 *  - keeps UIKit's container out of any externally managed view: the owner may
 *    reparent its subviews or restrict hit-testing to a private container at
 *    any time, and this view moves along as a unit, container included,
 *  - tracks scroll, resize, rotation and transforms with no layout-pass
 *    dependence.
 *
 * The owner embeds this view filling its bounds, attaches the context
 * controller to the closest parent view controller when it enters a window
 * and detaches it when it leaves. The views stay put either way: removing the
 * context view would tear UIKit's container (and a suspended presentation
 * with it) out of the hierarchy. The one party that does take the context
 * view out is UIKit itself, for the lifetime of a replacing
 * (`UIModalPresentationCurrentContext`) presentation, suspensions included;
 * it puts the view back on dismissal, and nothing here may re-insert it
 * earlier.
 */
@interface RNSContainedModalProviderView : UIView

/// The context controller (`definesPresentationContext == YES`) to present from.
@property (nonatomic, strong, readonly) RNSContainedModalProviderController *contextViewController;

/// Adds the context controller as a child of `parentViewController`; a no-op
/// when it already is, and re-parents when it has a different parent.
- (void)attachContextControllerToParentViewController:(UIViewController *)parentViewController;

/// Removes the context controller from its parent. The context view stays.
- (void)detachContextControllerFromParentViewController;

#if DEBUG
/**
 * Warns when `presentedView` (a content controller's view) is not inside a
 * presentation container that is this view's direct, exactly-filling subview.
 * The attach point is observed, not documented, UIKit behavior, and the
 * container's bounds are the modal's touch-blocking area, so an escaped
 * container means dead touch zones, not just a misplaced view.
 */
- (void)validateContainmentOfPresentedView:(nullable UIView *)presentedView;
#endif

@end

NS_ASSUME_NONNULL_END
