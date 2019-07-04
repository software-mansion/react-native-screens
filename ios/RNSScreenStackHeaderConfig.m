#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreen.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation RNSScreenStackHeaderConfig

- (instancetype)init
{
  if (self = [super init]) {
    self.hidden = YES;
  }
  return self;
}

- (UIViewController*)screen
{
  UIView *superview = self.superview;
  if ([superview isKindOfClass:[RNSScreenView class]]) {
    return ((RNSScreenView *)superview).controller;
  }
  return nil;
}

- (void)setAnimatedConfig:(UIViewController *)vc
{

  UINavigationBar *navbar = ((UINavigationController *)vc.parentViewController).navigationBar;
  navbar.tintColor = _tintColor;
  navbar.backgroundColor = _backgroundColor;
}

- (void)willShowViewController:(UIViewController *)vc
{
  UINavigationItem *navitem = vc.navigationItem;
//  UIBarButtonItem *bi = [[UIBarButtonItem alloc] initWithCustomView:[self.reactSubviews objectAtIndex:0]];
//  vc.navigationItem.rightBarButtonItem = bi;

  navitem.title = _title;
  if (_backTitle != nil) {
    navitem.backBarButtonItem = [[UIBarButtonItem alloc]
                                 initWithTitle:_backTitle
                                 style:UIBarButtonItemStylePlain
                                 target:nil
                                 action:nil];

  }

  if (@available(iOS 11.0, *)) {
    navitem.largeTitleDisplayMode = self.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
  }

  [((UINavigationController *)vc.parentViewController) setNavigationBarHidden:_hidden animated:YES];


  if (vc.transitionCoordinator != nil) {
    [vc.transitionCoordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
      [self setAnimatedConfig:vc];
    } completion:nil];
  } else {
    [self setAnimatedConfig:vc];
  }
}

@end

@implementation RNSScreenStackHeaderConfigManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSScreenStackHeaderConfig new];
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(backTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(largeTitle, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hidden, BOOL)

@end

@implementation RNSScreenStackHeaderTitleViewManager

RCT_EXPORT_MODULE()

@end
