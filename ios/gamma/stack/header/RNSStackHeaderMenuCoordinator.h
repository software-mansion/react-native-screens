#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderMenuData.h"
#import "RNSStackHeaderMenuToggleStateTracker.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuCoordinator : NSObject

/**
 Applies menu specification to the item. Sets up event delegate to receive
 menu updates when user selects options or clicks actions.
 Since menu needs to be rebuilt after user changes selection,
 the `menuToggleCallback` is triggered and the caller is expected
 to reapply the menu there.
 */
+ (void)applyMenu:(RNSStackHeaderMenuData *)data
             toBarButtonItem:(UIBarButtonItem *)item
    withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
          menuToggleCallback:(nullable void (^)(void))onMenuToggle;

@end

NS_ASSUME_NONNULL_END
