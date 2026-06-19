#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderMenuEventsDelegate <NSObject>

- (void)didPressMenuItem:(NSString *)menuItemId;

- (void)didChangeSelectionForMenu:(NSString *)menuElementId selectedMenuElementIds:(NSArray<NSString *> *)selectedIds;

@end

NS_ASSUME_NONNULL_END
