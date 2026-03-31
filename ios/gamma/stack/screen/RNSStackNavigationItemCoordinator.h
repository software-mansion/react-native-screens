#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;
@class RNSStackHeaderItemComponentView;

@interface RNSStackNavigationItemCoordinator : NSObject

- (void)applyConfiguration:(nonnull RNSStackHeaderData *)data
             forController:(nonnull RNSStackScreenController *)controller;

- (void)updateShadowStatesOfItems:(nonnull NSArray<RNSStackHeaderItemComponentView *> *)items
                  inNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
