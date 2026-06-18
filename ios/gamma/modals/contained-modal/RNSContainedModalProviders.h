#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSContainedModalPresentationProvider <NSObject>

- (BOOL)isOpen;
- (nullable UIView *)hostView;
- (nullable UIWindow *)hostWindow;

// The id of the container (provider) this modal should be presented in.
// Matched against `RNSContainedModalProviderComponentView.containerId`.
- (nullable NSString *)targetContainerId;

@end

NS_ASSUME_NONNULL_END
