#import "RNSStackScreenController.h"
#import "RNSLog.h"
#import "RNSStackHostComponentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentEventEmitter.h"
#import "RNSStackScreenComponentView.h"

@implementation RNSStackScreenController {
  RNSStackScreenComponentView *_Nonnull _screenView;
}

- (instancetype)initWithComponentView:(RNSStackScreenComponentView *)componentView
{
  if (self = [super initWithNibName:nil bundle:nil]) {
    _screenView = componentView;
  }
  return self;
}

- (RNSStackScreenComponentEventEmitter *)reactEventEmitter
{
  return [_screenView reactEventEmitter];
}

#pragma mark - Lifecycle Events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [[self reactEventEmitter] emitOnWillAppear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [[self reactEventEmitter] emitOnDidAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [[self reactEventEmitter] emitOnWillDisappear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [[self reactEventEmitter] emitOnDidDisappear];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  RNSLog(@"[RNScreens] Screen view with tag=%ld didMoveToParentViewController %@", (long)_screenView.tag, parent);
  [super didMoveToParentViewController:parent];

  if (parent == nil) {
    if (_screenView.activityMode == RNSStackScreenActivityModeDetached) {
      [[self reactEventEmitter] emitOnDismiss];
    } else {
      _screenView.isNativelyDismissed = YES;
      [[self reactEventEmitter] emitOnNativeDismiss];
    }
  }
}

@end
