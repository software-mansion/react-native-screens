#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderMenuEventsDelegate <NSObject>

- (void)didPressMenuItem:(NSString *)menuItemId;

@end

NS_ASSUME_NONNULL_END
