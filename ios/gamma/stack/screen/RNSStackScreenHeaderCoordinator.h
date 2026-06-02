#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackScreenHeaderCoordinator : NSObject

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller;

- (void)submitHeaderData:(nonnull RNSStackHeaderData *)data;

- (void)clearHeaderConfiguration;

@end

NS_ASSUME_NONNULL_END
