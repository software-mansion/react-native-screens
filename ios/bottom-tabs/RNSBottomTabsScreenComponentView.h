#import "RNSBottomTabsScreenEventEmitter.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsHostComponentView;
@class RNSTabsScreenViewController;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSBottomTabsScreenComponentView : RNSReactBaseView

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

@property (nonatomic, readonly) BOOL isSelectedScreen;
@property (nonatomic, readonly, nullable) NSString *tabKey;
@property (nonatomic, readonly, nullable) NSString *badgeValue;
@property (nonatomic, readonly, nullable) UIColor *badgeColor;

@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) NSNumber *titleFontSize;

@end

#pragma mark - Events

@interface RNSBottomTabsScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsScreenEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
