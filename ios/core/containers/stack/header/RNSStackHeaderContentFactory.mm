#import "RNSStackHeaderContentFactory.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSStackHeaderIconResolver.h"
#import "RNSStackHeaderItemWrapperView.h"
#import "RNSStackHeaderMenuCoordinator.h"

static BOOL RNSObjectsAreEqual(id _Nullable lhs, id _Nullable rhs)
{
  return lhs == rhs || [lhs isEqual:rhs];
}

@implementation RNSStackHeaderContentFactory

+ (UIBarButtonItem *)barButtonItemForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                        withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
                       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
                                withImageLoader:(id<RNSImageLoading>)imageLoader
                             iconLoadedCallback:(nullable void (^)(void))onIconLoaded
{
  if (item.customView != nil) {
    return [[UIBarButtonItem alloc] initWithCustomView:[self wrappedBarButtonItemViewForHeaderItem:item
                                                                               frameChangeDelegate:delegate]];
  }

  return [self labelBarButtonItemForHeaderItem:item
                      withHeaderEventsDelegate:headerEventsDelegate
                               withImageLoader:imageLoader
                            iconLoadedCallback:onIconLoaded];
}

+ (UIView *)wrappedBarButtonItemViewForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                              frameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    return [self makeWrappedInlineItemViewForIOS26WithContentView:item.customView frameChangeDelegate:delegate];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  return [self wrappedViewForHeaderItem:item frameChangeDelegate:delegate];
}

+ (UIBarButtonItem *)labelBarButtonItemForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                            withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
                                     withImageLoader:(id<RNSImageLoading>)imageLoader
                                  iconLoadedCallback:(nullable void (^)(void))onIconLoaded
{
  UIBarButtonItem *barButtonItem;
  if (item.respondsToOnPress) {
    barButtonItem = [[UIBarButtonItem alloc]
        initWithPrimaryAction:[self pressActionForHeaderItem:item withHeaderEventsDelegate:headerEventsDelegate]];
  } else {
    barButtonItem = [[UIBarButtonItem alloc] initWithTitle:item.title
                                                     style:UIBarButtonItemStylePlain
                                                    target:nil
                                                    action:nil];
  }

  [self updateLabelBarButtonItem:barButtonItem
                   forHeaderItem:item
        withHeaderEventsDelegate:headerEventsDelegate
                 withImageLoader:imageLoader
              iconLoadedCallback:onIconLoaded];

  return barButtonItem;
}

+ (UIAction *)pressActionForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
              withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
{
  __weak id<RNSStackHeaderEventsDelegate> weakDelegate = headerEventsDelegate;
  // The item itself is reported, not its id, so that the press reaches the right item also when the id changed,
  // is missing or is shared with another item.
  __weak id<RNSStackHeaderItemDataProviding> weakItem = item;
  return [UIAction actionWithTitle:item.title
                             image:nil
                        identifier:nil
                           handler:^(__kindof UIAction *_Nonnull action) {
                             id<RNSStackHeaderItemDataProviding> pressedItem = weakItem;
                             if (pressedItem != nil) {
                               [weakDelegate didPressHeaderItem:pressedItem];
                             }
                           }];
}

+ (void)updateBarButtonItem:(UIBarButtonItem *)barButtonItem
               forHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
     withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
    withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
             withImageLoader:(id<RNSImageLoading>)imageLoader
          iconLoadedCallback:(nullable void (^)(void))onIconLoaded
{
  UIView *customView = item.customView;
  if (customView != nil) {
    if (barButtonItem.customView == nil) {
      // The item has just got a custom view. What is left from the label is cleared, so that the bar button item is
      // the same as one created with the custom view.
      barButtonItem.primaryAction = nil;
      barButtonItem.title = nil;
      barButtonItem.image = nil;
      barButtonItem.style = UIBarButtonItemStylePlain;
      barButtonItem.tintColor = nil;
      barButtonItem.enabled = YES;
    }
    if (barButtonItem.customView == nil || customView.superview != barButtonItem.customView) {
      barButtonItem.customView = [self wrappedBarButtonItemViewForHeaderItem:item frameChangeDelegate:delegate];
    }
    // A custom view replaces the label of the bar button item and is styled by its own subviews.
    return;
  }

  if (barButtonItem.customView != nil) {
    barButtonItem.customView = nil;
  }

  [self updateLabelBarButtonItem:barButtonItem
                   forHeaderItem:item
        withHeaderEventsDelegate:headerEventsDelegate
                 withImageLoader:imageLoader
              iconLoadedCallback:onIconLoaded];
}

+ (void)updateLabelBarButtonItem:(UIBarButtonItem *)barButtonItem
                   forHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
        withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
                 withImageLoader:(id<RNSImageLoading>)imageLoader
              iconLoadedCallback:(nullable void (^)(void))onIconLoaded
{
  // `primaryAction` carries the title, so the action is replaced also when the title changes. Assigning an action
  // makes UIKit take the title and the image of the item from it, hence both are set again below.
  BOOL hasPressAction = barButtonItem.primaryAction != nil;
  BOOL pressActionDidChange = hasPressAction != item.respondsToOnPress ||
      (hasPressAction && !RNSObjectsAreEqual(barButtonItem.primaryAction.title, item.title ?: @""));
  if (pressActionDidChange) {
    barButtonItem.primaryAction = item.respondsToOnPress
        ? [self pressActionForHeaderItem:item withHeaderEventsDelegate:headerEventsDelegate]
        : nil;
  }

  if (pressActionDidChange || !RNSObjectsAreEqual(barButtonItem.title, item.title)) {
    barButtonItem.title = item.title;
  }

  if (barButtonItem.style != item.style) {
    barButtonItem.style = item.style;
  }

  if (!RNSObjectsAreEqual(barButtonItem.tintColor, item.itemTintColor)) {
    barButtonItem.tintColor = item.itemTintColor;
  }

  if (barButtonItem.enabled == item.disabled) {
    barButtonItem.enabled = !item.disabled;
  }

  UIImage *image = nil;
  RNSStackHeaderIconData *icon = item.icon;
  if (icon != nil) {
    __weak UIBarButtonItem *weakBarButtonItem = barButtonItem;
    __weak id<RNSStackHeaderItemDataProviding> weakItem = item;
    UIImage *syncImage = [RNSStackHeaderIconResolver resolveIcon:icon
                                                 withImageLoader:imageLoader
                                            asyncCompletionBlock:^(UIImage *_Nullable asyncImage) {
                                              if (weakBarButtonItem == nil) {
                                                RNSLogW(@"[RNScreens] Attempt to set image on nil UIBarButtonItem");
                                                return;
                                              }
                                              // The bar button item outlives a change of the icon, so an image
                                              // that arrives for an icon replaced in the meantime is dropped.
                                              if (weakItem.icon != icon || weakItem.customView != nil) {
                                                return;
                                              }
                                              weakBarButtonItem.image = asyncImage;
                                              if (onIconLoaded != nil) {
                                                onIconLoaded();
                                              }
                                            }];
    image = syncImage ? syncImage : [RNSStackHeaderIconResolver placeholderImageForIcon:icon];
  }

  if (pressActionDidChange || !RNSObjectsAreEqual(barButtonItem.image, image)) {
    barButtonItem.image = image;
  }
}

+ (UIView *)wrappedViewForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                 frameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
{
  UIView *contentView = item.customView;

  // The wrapper view is delegating the state update outside the view
  // and we expect that delegate to call viewFrameDidChange from outside.
  // This is needed for iOS 18 where there is no other way to sync all child elements
  // when one updates its side in a way that impacts the layout of others
  // (on iOS 26, this would work with just attaching the content view here).
  RNSStackHeaderItemWrapperView *wrapperView = [[RNSStackHeaderItemWrapperView alloc] initWithDelegate:delegate];
  wrapperView.translatesAutoresizingMaskIntoConstraints = NO;
  [wrapperView addSubview:contentView];

  [NSLayoutConstraint activateConstraints:@[
    [contentView.leadingAnchor constraintEqualToAnchor:wrapperView.leadingAnchor],
    [contentView.trailingAnchor constraintEqualToAnchor:wrapperView.trailingAnchor],
    [contentView.topAnchor constraintEqualToAnchor:wrapperView.topAnchor],
    [contentView.bottomAnchor constraintEqualToAnchor:wrapperView.bottomAnchor],
  ]];

  return wrapperView;
}

+ (UIBarButtonItem *)spacerForHeaderSpacerItem:(id<RNSStackHeaderItemSpacerDataProviding>)spacer
{
  if (spacer.isFlexible) {
    return [UIBarButtonItem flexibleSpaceItem];
  }

  return [UIBarButtonItem fixedSpaceItemOfWidth:spacer.width];
}

+ (void)updateBarButtonItem:(UIBarButtonItem *)barButtonItem
        forHeaderSpacerItem:(id<RNSStackHeaderItemSpacerDataProviding>)spacer
{
  if (!spacer.isFlexible && barButtonItem.width != spacer.width) {
    barButtonItem.width = spacer.width;
  }
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
+ (UIView *)makeWrappedInlineItemViewForIOS26WithContentView:(UIView *)contentView
                                         frameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
{
  // (taken from #3868)
  // Starting from iOS 26, UIBarButtonItem's customView is stretched to have at least 36 width.
  // To mitigate this, we add a wrapper view that will center the item inside of itself.
  RNSStackHeaderItemWrapperView *wrapperView = [[RNSStackHeaderItemWrapperView alloc] initWithDelegate:delegate];
  wrapperView.translatesAutoresizingMaskIntoConstraints = NO;
  // contentView has already opted out of default constraints with `translateAutoresizingMaskIntoConstraints = NO`
  [wrapperView addSubview:contentView];

  [contentView.centerXAnchor constraintEqualToAnchor:wrapperView.centerXAnchor].active = YES;
  [contentView.centerYAnchor constraintEqualToAnchor:wrapperView.centerYAnchor].active = YES;

  // To prevent UIKit from stretching subviews to all available width, we need to:
  // 1. Set width of wrapperView to match RNSScreenStackHeaderSubview BUT when
  //    RNSScreenStackHeaderSubview's width is smaller that minimal required 36 width, it breaks
  //    UIKit's constraint. That's why we need to lower the priority of the constraint.
  NSLayoutConstraint *widthEqual = [wrapperView.widthAnchor constraintEqualToAnchor:contentView.widthAnchor];
  widthEqual.priority = UILayoutPriorityDefaultHigh;
  widthEqual.active = YES;

  NSLayoutConstraint *heightEqual = [wrapperView.heightAnchor constraintEqualToAnchor:contentView.heightAnchor];
  heightEqual.priority = UILayoutPriorityDefaultHigh;
  heightEqual.active = YES;

  // 2. Set content hugging priority for header subview
  [contentView setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisHorizontal];
  [contentView setContentHuggingPriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];

  // 3. Set compression resistance to prevent UIKit from shrinking the subview below its intrinsic size.
  [contentView setContentCompressionResistancePriority:UILayoutPriorityRequired forAxis:UILayoutConstraintAxisVertical];
  [contentView setContentCompressionResistancePriority:UILayoutPriorityRequired
                                               forAxis:UILayoutConstraintAxisHorizontal];

  return wrapperView;
}
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

@end
