#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderMenuData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuCoordinator : NSObject

+ (void)applyMenu:(nonnull RNSStackHeaderMenuData *)data toBarButtonItem:(nonnull UIBarButtonItem *)item;

@end

NS_ASSUME_NONNULL_END
