#import "RNSStackScreenController.h"
#import "RNSStackHostComponentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentEventEmitter.h"
#import "RNSStackScreenComponentView.h"

@implementation RNSStackScreenController

- (instancetype)initWithComponentView:(RNSStackScreenComponentView *)componentView
{
  if (self = [super initWithNibName:nil bundle:nil]) {
    _screen = componentView;
  }
  return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder
{
  return nil;
}

- (RNSStackScreenComponentEventEmitter *)reactEventEmitter
{
  return [self.screen reactEventEmitter];
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
  NSLog(@"ScreenCtrl [%ld] didMoveToParent %@", (long)self.screen.tag, parent);
  [super didMoveToParentViewController:parent];

  if (parent == nil) {
    self.screen.isNativelyDismissed = YES;
    if (self.screen.activityMode == RNSStackScreenActivityModeAttached) {
      [[self reactEventEmitter] emitOnDismiss];
    } else {
      [[self reactEventEmitter] emitOnNativeDismiss];
    }
  }
}

@end
