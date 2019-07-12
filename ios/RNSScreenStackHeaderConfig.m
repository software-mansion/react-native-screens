#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreen.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@interface RNSScreenStackHeaderSubview : UIView

@property (nonatomic, weak) UIView *reactSuperview;
@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@end

@implementation RNSScreenStackHeaderConfig {
  NSMutableArray<RNSScreenStackHeaderSubview *> *_reactSubviews;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.hidden = YES;
    _translucent = YES;
    _reactSubviews = [NSMutableArray new];
  }
  return self;
}

- (void)insertReactSubview:(RNSScreenStackHeaderSubview *)subview atIndex:(NSInteger)atIndex
{
  [_reactSubviews insertObject:subview atIndex:atIndex];
  subview.reactSuperview = self;
}

- (void)removeReactSubview:(RNSScreenStackHeaderSubview *)subview
{
  [_reactSubviews removeObject:subview];
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
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
  [navbar setTintColor:_color];
  [navbar setBarTintColor:_backgroundColor];
  [navbar setTranslucent:_translucent];
  [navbar setValue:@(_hideShadow ? YES : NO) forKey:@"hidesShadow"];
}

- (void)willShowViewController:(UIViewController *)vc
{
  UINavigationItem *navitem = vc.navigationItem;
  UINavigationController *navctr = (UINavigationController *)vc.parentViewController;

  NSUInteger currentIndex = [navctr.viewControllers indexOfObject:vc];
  UINavigationItem *prevItem = currentIndex > 0 ? [navctr.viewControllers objectAtIndex:currentIndex - 1].navigationItem : nil;

  BOOL wasHidden = navctr.navigationBarHidden;

  [navctr setNavigationBarHidden:_hide animated:YES];
  navctr.interactivePopGestureRecognizer.enabled = _gestureEnabled;
  if (_hide) {
    return;
  }

  navitem.title = _title;
  navitem.hidesBackButton = _hideBackButton;
  if (_backTitle != nil) {
    prevItem.backBarButtonItem = [[UIBarButtonItem alloc]
                                  initWithTitle:@"Fooo"
                                  style:UIBarButtonItemStylePlain
                                  target:nil
                                  action:nil];
  } else {
    prevItem.backBarButtonItem = nil;
  }

  if (@available(iOS 11.0, *)) {
    if (self.largeTitle) {
      navctr.navigationBar.prefersLargeTitles = YES;
    }
    navitem.largeTitleDisplayMode = self.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
  }

  for (RNSScreenStackHeaderSubview *subview in _reactSubviews) {
    switch (subview.type) {
      case RNSScreenStackHeaderSubviewTypeLeft: {
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.leftBarButtonItem = buttonItem;
        break;
      }
      case RNSScreenStackHeaderSubviewTypeRight: {
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.rightBarButtonItem = buttonItem;
        break;
      }
      case RNSScreenStackHeaderSubviewTypeTitle: {
        navitem.titleView = subview;
        break;
      }
    }
  }

  if (vc.transitionCoordinator != nil && !wasHidden) {
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
RCT_EXPORT_VIEW_PROPERTY(color, UIColor)
RCT_EXPORT_VIEW_PROPERTY(largeTitle, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideBackButton, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideShadow, BOOL)
// `hidden` is an UIView property, we need to use different name internally
RCT_REMAP_VIEW_PROPERTY(hidden, hide, BOOL)
RCT_EXPORT_VIEW_PROPERTY(translucent, BOOL)
RCT_EXPORT_VIEW_PROPERTY(gestureEnabled, BOOL)

@end

@implementation RCTConvert (RNSScreenStackHeader)

RCT_ENUM_CONVERTER(RNSScreenStackHeaderSubviewType, (@{
   @"left": @(RNSScreenStackHeaderSubviewTypeLeft),
   @"right": @(RNSScreenStackHeaderSubviewTypeRight),
   @"title": @(RNSScreenStackHeaderSubviewTypeTitle),
   }), RNSScreenStackHeaderSubviewTypeTitle, integerValue)

@end



@implementation RNSScreenStackHeaderSubview
@end

@implementation RNSScreenStackHeaderSubviewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(type, RNSScreenStackHeaderSubviewType)

- (UIView *)view
{
  return [RNSScreenStackHeaderSubview new];
}

@end
