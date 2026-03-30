#import "RNSModal.h"
#import <React/RCTConversions.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

static UIModalPresentationStyle RNSUIModalPresentationStyleFromCpp(react::RNSModalPresentation presentation)
{
  switch (presentation) {
    case react::RNSModalPresentation::Automatic:
      return UIModalPresentationAutomatic;
    case react::RNSModalPresentation::FullScreen:
      return UIModalPresentationFullScreen;
    case react::RNSModalPresentation::PageSheet:
      return UIModalPresentationPageSheet;
    case react::RNSModalPresentation::FormSheet:
      return UIModalPresentationFormSheet;
    case react::RNSModalPresentation::CurrentContext:
      return UIModalPresentationCurrentContext;
    case react::RNSModalPresentation::Custom:
      return UIModalPresentationCustom;
    case react::RNSModalPresentation::OverFullScreen:
      return UIModalPresentationOverFullScreen;
    case react::RNSModalPresentation::OverCurrentContext:
      return UIModalPresentationOverCurrentContext;
    case react::RNSModalPresentation::Popover:
      return UIModalPresentationPopover;
  }
}

@interface RNSModal () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSModal {
  UIViewController *_sheetViewController;
  RCTSurfaceTouchHandler *_touchHandler;
  NSMutableArray<UIView *> *_reactSubviews;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSModalProps>();
    _props = defaultProps;
    _reactSubviews = [NSMutableArray new];
    _sheetViewController = [[UIViewController alloc] init];

    _touchHandler = [RCTSurfaceTouchHandler new];
    [_touchHandler attachToView:_sheetViewController.view];

    // This view is a logical container only; the content lives inside the presented sheet.
    self.hidden = YES;
  }
  return self;
}

- (void)dealloc
{
  if (_sheetViewController.presentingViewController) {
    [_sheetViewController dismissViewControllerAnimated:NO completion:nil];
  }
}

#pragma mark - Children

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_sheetViewController.view insertSubview:childComponentView atIndex:index];
  [_reactSubviews insertObject:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
  [_reactSubviews removeObjectAtIndex:index];
}

#pragma mark - Props

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &oldModalProps = static_cast<const react::RNSModalProps &>(*_props);
  const auto &newModalProps = static_cast<const react::RNSModalProps &>(*props);

  _sheetViewController.modalPresentationStyle = RNSUIModalPresentationStyleFromCpp(newModalProps.presentation);

  if (oldModalProps.presented != newModalProps.presented) {
    if (newModalProps.presented) {
      [self presentSheet];
    } else {
      [self dismissSheet];
    }
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)presentSheet
{
  if (_sheetViewController.presentingViewController) {
    return;
  }

  UIViewController *presentingVC = [self findPresentingViewController];
  if (!presentingVC) {
    return;
  }

  _sheetViewController.presentationController.delegate = self;

  UISheetPresentationController *sheet = _sheetViewController.sheetPresentationController;
  if (sheet != nil) {
    sheet.detents = @[
      [UISheetPresentationControllerDetent mediumDetent],
      [UISheetPresentationControllerDetent largeDetent],
    ];
    sheet.prefersGrabberVisible = YES;
    sheet.prefersScrollingExpandsWhenScrolledToEdge = YES;
  }

  [presentingVC presentViewController:_sheetViewController animated:YES completion:nil];
}

- (void)dismissSheet
{
  if (_sheetViewController.presentingViewController) {
    [_sheetViewController dismissViewControllerAnimated:YES completion:nil];
  }
}

- (UIViewController *)findPresentingViewController
{
  UIResponder *responder = self;
  while (responder != nil) {
    if ([responder isKindOfClass:[UIViewController class]]) {
      return (UIViewController *)responder;
    }
    responder = responder.nextResponder;
  }
  return self.window.rootViewController;
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSModalEventEmitter>(_eventEmitter)
        ->onDismiss(react::RNSModalEventEmitter::OnDismiss{});
  }
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}

#pragma mark - RCTComponentViewProtocol

+ (BOOL)shouldBeRecycled
{
  return NO;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSModalComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> RNSModalCls(void)
{
  return RNSModal.class;
}
