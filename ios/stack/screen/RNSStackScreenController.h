#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainerItem.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenComponentView;
@class RNSStackController;
@class RNSStackScreenHeaderCoordinator;

@interface RNSStackScreenController : UIViewController <RNSContainerItem>

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenHeaderCoordinator *headerCoordinator;

- (instancetype)initWithComponentView:(RNSStackScreenComponentView *)componentView;

@end

NS_ASSUME_NONNULL_END
