#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSDismissibleModalProtocol <NSObject>

// If NO is returned, the modal will not be dismissed when new modal is presented.
// Use it on your own responsibility, as it can lead to unexpected behavior.
- (BOOL)isDismissible;

@optional
// If the modal is non-dismissible, it can optionally provide a view controller
// that should be used as the presenting controller for subsequent modals.
// This gives the external modal implementation control over the presentation chain.
// If not implemented or returns nil, the original implementation will continue.
- (nullable UIViewController *)newPresentingViewController;

@end

NS_ASSUME_NONNULL_END
