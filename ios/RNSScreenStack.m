#import "RNSScreenStack.h"
#import "RNSScreen.h"
#import "RNSScreenStackHeaderConfig.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@interface RNSScreenStackView () <UINavigationControllerDelegate>

@end

@implementation RNSScreenStackView {
  BOOL _needUpdate;
  UINavigationController *_controller;
  NSMutableArray<RNSScreenView *> *_reactSubviews;
  NSMutableArray<UIViewController *> *_presentedModals;
  __weak RNSScreenStackManager *_manager;
}

- (instancetype)initWithManager:(RNSScreenStackManager*)manager
{
  if (self = [super init]) {
    _manager = manager;
    _reactSubviews = [NSMutableArray new];
    _presentedModals = [NSMutableArray new];
    _controller = [[UINavigationController alloc] init];
//    _controller.navigationBar.hidden = YES;
    if (@available(iOS 11.0, *)) {
      _controller.navigationBar.prefersLargeTitles = YES;
    }
    _controller.delegate = self;
    _needUpdate = NO;
    [self addSubview:_controller.view];
  }
  return self;
}

- (void)navigationController:(UINavigationController *)navigationController willShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  UIView *view = viewController.view;
  for (UIView *subview in view.reactSubviews) {
    if ([subview isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
      [((RNSScreenStackHeaderConfig*) subview) willShowViewController:viewController];
      break;
    }
  }
}

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  for (NSUInteger i = _reactSubviews.count - 1; i >= 0; i--) {
    if ([viewController isEqual:[_reactSubviews objectAtIndex:i].controller]) {
      break;
    } else {
      // TODO: send dismiss event
      [_reactSubviews objectAtIndex:i].dismissed = YES;
    }
  }
}

- (void)markUpdated
{
  // We want 'updateContainer' to be executed on main thread after all enqueued operations in
  // uimanager are complete. In order to achieve that we enqueue call on UIManagerQueue from which
  // we enqueue call on the main queue. This seems to be working ok in all the cases I've tried but
  // there is a chance it is not the correct way to do that.
  if (!_needUpdate) {
    _needUpdate = YES;
    RCTExecuteOnUIManagerQueue(^{
      RCTExecuteOnMainQueue(^{
        _needUpdate = NO;
        [self updateContainer];
      });
    });
  }
}

- (void)markChildUpdated
{
  // do nothing
}

- (void)didUpdateChildren
{
  // do nothing
}

- (void)insertReactSubview:(RNSScreenView *)subview atIndex:(NSInteger)atIndex
{
  [_reactSubviews insertObject:subview atIndex:atIndex];
  [self markUpdated];
}

- (void)removeReactSubview:(RNSScreenView *)subview
{
  [_reactSubviews removeObject:subview];
  [self markUpdated];
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}

- (void)didUpdateReactSubviews
{
  // do nothing
}

- (void)setModalViewControllers:(NSArray<UIViewController *> *) controllers
{
  NSMutableArray<UIViewController *> *newControllers = [NSMutableArray arrayWithArray:controllers];
  [newControllers removeObjectsInArray:_presentedModals];
  [newControllers removeObject:controllers.firstObject];

  NSMutableArray<UIViewController *> *controllersToRemove = [NSMutableArray arrayWithArray:_presentedModals];
  [controllersToRemove removeObjectsInArray:controllers];

  [_controller setViewControllers:@[controllers.firstObject]];

  // presenting new controllers
  for (UIViewController *newController in newControllers) {
    [_presentedModals addObject:newController];
    newController.modalPresentationStyle = UIModalPresentationCurrentContext;
    if (_controller.presentedViewController != nil) {
      [_controller.presentedViewController presentViewController:newController animated:YES completion:nil];
    } else {
      [_controller presentViewController:newController animated:YES completion:nil];
    }
  }

  // hiding old controllers
  for (UIViewController *controller in [controllersToRemove reverseObjectEnumerator]) {
    [_presentedModals removeObject:controller];
    if (controller.presentedViewController != nil) {
      UIViewController *restore = controller.presentedViewController;
      UIViewController *parent = controller.presentingViewController;
      [controller dismissViewControllerAnimated:NO completion:^{
        [parent dismissViewControllerAnimated:NO completion:^{
          [parent presentViewController:restore animated:NO completion:nil];
        }];
      }];
    } else {
      [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
    }
  }
}

- (void)updateContainer
{
  NSMutableArray<UIViewController *> *controllers = [NSMutableArray new];
  for (RNSScreenView *screen in _reactSubviews) {
    if (!screen.dismissed) {
      [controllers addObject:screen.controller];
    }
  }

  [_controller setViewControllers:controllers animated:YES];
//  [self setModalViewControllers:controllers];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [self reactAddControllerToClosestParent:_controller];
  _controller.view.frame = self.bounds;
}

@end


@implementation RNSScreenStackManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(transitioning, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(progress, CGFloat)

- (UIView *)view
{
  return [[RNSScreenStackView alloc] initWithManager:self];
}

@end
