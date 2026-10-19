#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * The presentation context for contained modals. Its view fills the provider
 * component view's bounds; `definesPresentationContext == YES` makes UIKit
 * anchor contained presentations here instead of walking further up.
 *
 * INVARIANT: this controller's view's direct superview must always be the
 * provider component view (the wrapper). UIKit attaches the presentation
 * container to the context view's superview, sized to that superview's bounds
 * with a flexible autoresizing mask - the tight wrapper is what confines the
 * presentation to the provider and keeps it tracking through scroll, resize
 * and rotation. Any view injected between the two breaks containment.
 */
@interface RNSContainedModalProviderController : UIViewController

@end

NS_ASSUME_NONNULL_END
