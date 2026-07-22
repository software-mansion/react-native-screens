#pragma once

#import <UIKit/UIKit.h>
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainedModalProviderComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly) UIViewController *contextViewController;

// Identifies this provider (container). A `ContainedModal` is presented in the
// provider whose `containerId` matches the modal's `targetContainerId`.
// `nil` when unset.
@property (nonatomic, copy, readonly, nullable) NSString *containerId;

@end

NS_ASSUME_NONNULL_END
