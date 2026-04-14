#pragma once

#import <UIKit/UIKit.h>
#import "RNSSplitHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitNavigationBarCoordinator : NSObject

- (void)applyConfiguration:(nonnull RNSSplitHeaderData *)data
    forNavigationController:(nonnull UINavigationController *)navigationController
                   animated:(BOOL)animated;

@end

NS_ASSUME_NONNULL_END
