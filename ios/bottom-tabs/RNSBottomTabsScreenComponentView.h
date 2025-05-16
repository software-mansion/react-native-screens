#import <React/RCTViewComponentView.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsHostComponentView;
@class RNSTabsScreenViewController;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSBottomTabsScreenComponentView : RCTViewComponentView

/**
 * View controller responsible for managing tab represented by this component view.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsScreenViewController *controller;

/**
 * If not null, the bottom tabs host view that this tab component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

@end

#pragma mark - Props

/**
 * Properties set on component in JavaScript.
 */
@interface RNSBottomTabsScreenComponentView ()

@property (nonatomic, readonly) BOOL isFocused;
@property (nonatomic, readonly, nullable) NSString *badgeValue;
@property (nonatomic, readonly, nullable) UIColor *badgeColor;
@property (nonatomic, readonly, nullable) NSString *title;

@end

#pragma mark - Events

/**
 * These methods can be called to send an appropriate event to ElementTree.
 * Returned value denotes whether the event has been successfully dispatched to React event pipeline.
 * The returned value of `true` does not mean, that the event has been successfully delivered.
 */
@interface RNSBottomTabsScreenComponentView ()

/**
 * This pointer might be `nullptr`!  All this method does is a cast of the backing field inherited from
 * `RCTViewComponentView`. The nullability of this pointer is therefore determined by `_eventEmitter` lifecycle in the
 * super class.
 */
- (std::shared_ptr<const facebook::react::RNSBottomTabsScreenEventEmitter>)reactEventEmitter;

- (bool)emitOnWillAppear;
- (bool)emitOnDidAppear;
- (bool)emitOnWillDisappear;
- (bool)emitOnDidDisappear;

@end

NS_ASSUME_NONNULL_END
