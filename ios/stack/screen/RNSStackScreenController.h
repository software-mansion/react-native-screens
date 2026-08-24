#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainerItem.h"
#import "RNSStackBackButtonDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenComponentView;
@class RNSStackController;
@class RNSStackScreenHeaderCoordinator;

@interface RNSStackScreenController : UIViewController <RNSContainerItem, RNSStackBackButtonDelegate>

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenHeaderCoordinator *headerCoordinator;

/**
 The screen below this one in the stack, receiving this screen's back button
 configuration. Assigned by the navigation controller right before this screen
 is pushed; nil for the root screen or while not in a stack.
 */
@property (nonatomic, weak, nullable) id<RNSStackBackButtonDelegate> backButtonDelegate;

- (instancetype)initWithComponentView:(RNSStackScreenComponentView *)componentView;

@end

NS_ASSUME_NONNULL_END
