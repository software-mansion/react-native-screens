#import "RNSScreenStackHeaderConfigComponentView.h"
#import "RNSScreenStackHeaderSubviewComponentView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation RNSScreenStackHeaderConfigComponentView {
  BOOL _initialPropsSet;
  NSMutableArray<RNSScreenStackHeaderSubviewComponentView *> *_reactSubviews;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSScreenStackHeaderConfigProps>();
    _props = defaultProps;
    self.hidden = YES;
    _show = YES;
    _translucent = NO;
    _reactSubviews = [NSMutableArray new];
  }

  return self;
}

- (UIView *)reactSuperview
{
  return _screenView;
}

- (void)removeFromSuperview
{
  [super removeFromSuperview];
  _screenView = nil;
}

- (void)updateViewControllerIfNeeded
{
  UIViewController *vc = _screenView.controller;
  UINavigationController *nav = (UINavigationController *)vc.parentViewController;
  UIViewController *nextVC = nav.visibleViewController;
  if (nav.transitionCoordinator != nil) {
    // if navigator is performing transition instead of allowing to update of `visibleConttroller`
    // we look at `topController`. This is because during transitiong the `visibleController` won't
    // point to the controller that is going to be revealed after transition. This check fixes the
    // problem when config gets updated while the transition is ongoing.
    nextVC = nav.topViewController;
  }
  
  if (vc != nil && (nextVC == vc)) {
    [RNSScreenStackHeaderConfigComponentView updateViewController:self.screenView.controller withConfig:self animated:YES];
  }
}

- (void)layoutNavigationControllerView
{
  UIViewController *vc = _screenView.controller;
  UINavigationController *navctr = vc.navigationController;
  [navctr.view setNeedsLayout];
}

+ (void)willShowViewController:(UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(RNSScreenStackHeaderConfigComponentView *)config
{
  [self updateViewController:vc withConfig:config animated:animated];
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
+ (UINavigationBarAppearance *)buildAppearance:(UIViewController *)vc
                                    withConfig:(RNSScreenStackHeaderConfigComponentView *)config API_AVAILABLE(ios(13.0))
{
  UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];

    [appearance configureWithOpaqueBackground];

  return appearance;
}
#endif

+ (void)updateViewController:(UIViewController *)vc
                  withConfig:(RNSScreenStackHeaderConfigComponentView *)config
                    animated:(BOOL)animated
{
  UINavigationItem *navitem = vc.navigationItem;
  UINavigationController *navctr = (UINavigationController *)vc.parentViewController;

  BOOL shouldHide = config == nil || !config.show;

  if (!shouldHide && !config.translucent) {
    // when nav bar is not translucent we chage edgesForExtendedLayout to avoid system laying out
    // the screen underneath navigation controllers
    vc.edgesForExtendedLayout = UIRectEdgeNone;
  } else {
    // system default is UIRectEdgeAll
    vc.edgesForExtendedLayout = UIRectEdgeAll;
  }

  [navctr setNavigationBarHidden:shouldHide animated:animated];

  if (shouldHide) {
    return;
  }

  navitem.title = @"test title";

  if (@available(iOS 13.0, tvOS 13.0, *)) {
    UINavigationBarAppearance *appearance = [self buildAppearance:vc withConfig:config];
    navitem.standardAppearance = appearance;
    navitem.compactAppearance = appearance;

    UINavigationBarAppearance *scrollEdgeAppearance =
    [[UINavigationBarAppearance alloc] initWithBarAppearance:appearance];
    navitem.scrollEdgeAppearance = scrollEdgeAppearance;
  }
  navitem.leftBarButtonItem = nil;
  navitem.rightBarButtonItem = nil;
  navitem.titleView = nil;
  [RNSScreenStackHeaderConfigComponentView addSubviewsToNavItem:navitem withConfig:config];
}

+ (void)addSubviewsToNavItem:(UINavigationItem*)navitem withConfig:(RNSScreenStackHeaderConfigComponentView*)config
{
    for (RNSScreenStackHeaderSubviewComponentView *subview in config.reactSubviews) {
        switch (subview.type) {
          case facebook::react::RNSScreenStackHeaderSubviewType::Left: {
              UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
              navitem.leftBarButtonItem = buttonItem;
            break;
          }
          case facebook::react::RNSScreenStackHeaderSubviewType::Right: {
              UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
              navitem.rightBarButtonItem = buttonItem;
            break;
          }
          case facebook::react::RNSScreenStackHeaderSubviewType::Center: {
            navitem.titleView = subview;
            break;
          }
          case facebook::react::RNSScreenStackHeaderSubviewType::SearchBar: {
              RCTLogWarn(
                  @"SearchBar is not yet supported in ScreensFabric");
              break;
          }
          case facebook::react::RNSScreenStackHeaderSubviewType::Back: {
            break;
          }
        }
      }
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
    if (![childComponentView isKindOfClass:[RNSScreenStackHeaderSubviewComponentView class]]) {
      RCTLogError(@"ScreenStackHeader only accepts children of type ScreenStackHeaderSubview");
      return;
    }
    
    RCTAssert(
        childComponentView.superview == nil,
        @"Attempt to mount already mounted component view. (parent: %@, child: %@, index: %@, existing parent: %@)",
        self,
        childComponentView,
        @(index),
        @([childComponentView.superview tag]));
    
    [_reactSubviews insertObject:(RNSScreenStackHeaderSubviewComponentView*)childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews removeObject:(RNSScreenStackHeaderSubviewComponentView*)childComponentView];
  [childComponentView removeFromSuperview];
}

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _initialPropsSet = NO;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSScreenStackHeaderConfigComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  [super updateProps:props oldProps:oldProps];

  const auto &oldScreenProps = *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(props);

  BOOL needsNavigationControlerLayout = !_initialPropsSet;

  if (newScreenProps.hidden != !_show) {
    _show = !newScreenProps.hidden;
    needsNavigationControlerLayout=YES;
  }

  if (newScreenProps.translucent != _translucent) {
    _translucent = newScreenProps.translucent;
    needsNavigationControlerLayout=YES;
  }

  [self updateViewControllerIfNeeded];

  if(needsNavigationControlerLayout){
    [self layoutNavigationControllerView];
  }

  _initialPropsSet = YES;
  _props = std::static_pointer_cast<RNSScreenStackHeaderConfigProps const>(props);
}


#pragma mark - Native Commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
//  RCTSwitchHandleCommand(self, commandName, args);
}

@end

Class<RCTComponentViewProtocol> RNSScreenStackHeaderConfigCls(void)
{
  return RNSScreenStackHeaderConfigComponentView.class;
}
