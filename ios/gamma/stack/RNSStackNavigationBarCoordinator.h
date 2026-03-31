#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackNavigationBarCoordinator : NSObject

- (void)applyConfiguration:(nonnull RNSStackHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated;

@end

NS_ASSUME_NONNULL_END
