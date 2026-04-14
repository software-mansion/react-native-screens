#pragma once
#import <UIKit/UIKit.h>
#import "RNSSplitHeaderData.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitScreenController;

@interface RNSSplitScreenHeaderCoordinator : NSObject

- (instancetype)initWithScreenController:(RNSSplitScreenController *)controller;
- (void)submitHeaderData:(nonnull RNSSplitHeaderData *)data;
- (void)applyBarConfigurationIfNeeded:(BOOL)animated;
- (void)updateShadowStatesToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
