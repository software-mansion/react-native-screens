#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackNavigationItemCoordinator : NSObject

- (void)applyConfiguration:(nonnull RNSStackHeaderData *)data
             forController:(nonnull RNSStackScreenController *)controller;

@end

NS_ASSUME_NONNULL_END
