#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemComponentView
    : RNSReactBaseView <RNSStackHeaderItemDataProviding, RNSViewFrameChangeDelegate>

@property (nonatomic, readonly) RNSHeaderItemPlacement placement;
@property (nonatomic, readonly, nullable) NSString *itemId;
@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) RNSStackHeaderIconData *icon;
@property (nonatomic, readonly, nullable) RNSStackHeaderMenuData *menu;
@property (nonatomic, readonly, nullable) UIView *customView;
@property (nonatomic, readonly) BOOL respondsToOnPress;

@property (nonatomic, nullable) NSString *titleProp;
@property (nonatomic, nullable) RNSStackHeaderIconData *iconProp;
@property (nonatomic, nullable) RNSStackHeaderMenuData *menuProp;

@property (nonatomic, weak, nullable) id<RNSStackHeaderItemInvalidationDelegate> invalidationDelegate;

- (void)emitOnPress;

/**
 * Replaces a menu element in the item's menu tree with a new element constructed from command options.
 * If parentMenu is nil, the element is the root menu and is replaced directly.
 */
- (void)updateMenuElementWithId:(NSString *)elementId
                    withElement:(id<RNSStackHeaderMenuElement>)newElement
                     parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu;

@end

NS_ASSUME_NONNULL_END

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

#import <rnscreens/RNSStackHeaderItemComponentDescriptor.h>

@interface RNSStackHeaderItemComponentView ()

- (facebook::react::RNSStackHeaderItemShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)
