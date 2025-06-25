#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

typedef NS_ENUM(int, RNSScreenStackLifecycleState) {
  RNSScreenStackLifecycleStateInitial = 0, // JS rendered & detached native
  RNSScreenStackLifecycleStateVisible = 1, // JS rendered & attached native
  RNSScreenStackLifecycleStateFreezed = 2, // JS rendered+freezed & detached native
  RNSScreenStackLifecycleStatePopped = 3, // JS rendered & detaching native
};

@interface RNSStackScreenComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenController *controller;

@property (nonatomic, strong, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly) RNSScreenStackLifecycleState lifecycleState;

@end

#pragma mark - Events

@interface RNSStackScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSStackScreenComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
