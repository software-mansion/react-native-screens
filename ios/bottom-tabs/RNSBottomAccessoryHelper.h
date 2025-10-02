#import <UIKit/UIKit.h>
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomTabsAccessoryWrapperView.h"

#if defined(__cplusplus)
#import <react/renderer/core/State.h>

namespace react = facebook::react;
#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

API_AVAILABLE(ios(26.0))
@interface RNSBottomAccessoryHelper : NSObject

- (instancetype)initWithBottomAccessoryView:(RNSBottomTabsAccessoryComponentView *)bottomAccessoryView;
- (void)notifyTransitionStart;

@end

#if defined(__cplusplus)

@interface RNSBottomAccessoryHelper ()

- (void)updateState:(const react::State::Shared &)state oldState:(const react::State::Shared &)oldState;

@end

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_END
