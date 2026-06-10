#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderMenuData.h"
#import "RNSStackHeaderMenuEventsDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuCoordinator : NSObject

+ (void)applyMenu:(RNSStackHeaderMenuData *)data
           toBarButtonItem:(UIBarButtonItem *)item
    withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END
