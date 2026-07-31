#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackNavigationBarCoordinator : NSObject

- (void)setHidden:(BOOL)hidden
    forNavigationController:(UINavigationController *)navigationController
                   animated:(BOOL)animated;

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController;

@end

NS_ASSUME_NONNULL_END
