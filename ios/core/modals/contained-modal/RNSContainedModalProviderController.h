#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The presentation context for contained modals. Its view fills the provider
 * component view's bounds; `definesPresentationContext == YES` makes UIKit
 * anchor contained presentations here instead of walking further up.
 *
 * INVARIANT: this controller's view's direct superview must always be the
 * provider component view (the wrapper). UIKit attaches its presentation
 * container to the context view's superview, sized to that superview's bounds
 * with a flexible autoresizing mask (observed, undocumented behavior), and the
 * container swallows every direct touch inside its bounds. The tight wrapper
 * therefore makes container == provider, which
 *  - scopes the modal's touch blocking exactly to the provider,
 *  - keeps UIKit's container out of React-managed views, where Fabric could
 *    mount sibling views above it,
 *  - tracks scroll, resize, rotation and transforms with no layout-pass
 *    dependence.
 * A view injected between the two breaks all three.
 */
@interface RNSContainedModalProviderController : UIViewController

@end

NS_ASSUME_NONNULL_END
