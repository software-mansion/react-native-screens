#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenComponentView;
@class RNSStackScreenController;

@interface RNSStackScreenHeaderCoordinator : NSObject

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller;

- (void)submitHeaderData:(nonnull RNSStackHeaderData *)data;

- (void)applyBarConfigurationIfNeeded:(BOOL)animated;

- (void)updateShadowStatesToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
