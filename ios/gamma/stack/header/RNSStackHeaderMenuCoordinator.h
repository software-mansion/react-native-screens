#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderMenuData.h"
#import "RNSStackHeaderMenuEventsDelegate.h"
#import "RNSStackHeaderMenuToggleStateTracker.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuCoordinator : NSObject

+ (void)applyMenu:(RNSStackHeaderMenuData *)data
           toBarButtonItem:(UIBarButtonItem *)item
    withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
              stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker;

@end

NS_ASSUME_NONNULL_END
