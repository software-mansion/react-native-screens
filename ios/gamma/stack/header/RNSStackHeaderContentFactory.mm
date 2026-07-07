#import "RNSStackHeaderContentFactory.h"
#import "RNSDefines.h"
#import "RNSStackHeaderItemWrapperView.h"
#import "RNSStackHeaderMenuCoordinator.h"

@implementation RNSStackHeaderContentFactory

+ (UIBarButtonItem *)barButtonItemForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                        withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
                       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
{
  if (item.customView != nil) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    if (@available(iOS 26.0, *)) {
      return [[UIBarButtonItem alloc]
          initWithCustomView:[self makeWrappedInlineItemViewForIOS26WithContentView:item.customView
                                                                frameChangeDelegate:delegate]];
    }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    return [[UIBarButtonItem alloc] initWithCustomView:[self wrappedViewForHeaderItem:item
                                                                  frameChangeDelegate:delegate]];
  }

  if (item.respondsToOnPress) {
    __weak id<RNSStackHeaderEventsDelegate> weakDelegate = headerEventsDelegate;
    NSString *itemId = item.itemId;
    UIAction *pressAction = [UIAction actionWithTitle:item.title
                                                image:nil
                                           identifier:nil
                                              handler:^(__kindof UIAction *_Nonnull action) {
                                                [weakDelegate didPressHeaderItem:itemId];
                                              }];
    return [[UIBarButtonItem alloc] initWithPrimaryAction:pressAction];
  }

  return [[UIBarButtonItem alloc] initWithTitle:item.title style:UIBarButtonItemStylePlain target:nil action:nil];
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
