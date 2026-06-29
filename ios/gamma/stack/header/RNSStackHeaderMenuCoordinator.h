#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderMenuData.h"
#import "RNSStackHeaderMenuToggleStateTracker.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuCoordinator : NSObject

+ (void)applyMenu:(RNSStackHeaderMenuData *)data
             toBarButtonItem:(UIBarButtonItem *)item
    withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker;

@end

NS_ASSUME_NONNULL_END
