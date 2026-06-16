#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderMenuEventsDelegate <NSObject>

- (void)didPressMenuItem:(NSString *)menuElementId;

@end

NS_ASSUME_NONNULL_END
