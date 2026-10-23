#import "RNSStackScreenController.h"
#import "RNSContainer.h"
#import "RNSContainerItemSupport.h"
#import "RNSLog.h"
#import "RNSStackScreenHeaderCoordinator.h"

@implementation RNSStackScreenController {
  RNSContainerItemSupport *_Nonnull _containerItemSupport;
}

- (instancetype)initWithNibName:(nullable NSString *)nibNameOrNil bundle:(nullable NSBundle *)nibBundleOrNil
{
  if (self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil]) {
    _headerCoordinator = [[RNSStackScreenHeaderCoordinator alloc] initWithScreenController:self];
    _containerItemSupport = [RNSContainerItemSupport new];
  }
  return self;
}

#pragma mark - RNSContainerItem

- (void)registerNestedContainer:(id<RNSContainer>)container
{
  [_containerItemSupport registerNestedContainer:container];
}

- (void)unregisterNestedContainer:(id<RNSContainer>)container
{
  [_containerItemSupport unregisterNestedContainer:container];
}

- (nullable id<RNSContainer>)resolveNestedContainer
{
  return [_containerItemSupport resolveNestedContainer];
}

- (nullable UIScrollView *)findContentScrollView
{
  return [_containerItemSupport findContentScrollViewWithCachedScrollView:[_dataProvider cachedContentScrollView]
                                                            heuristicRoot:self.view];
}

#pragma mark - Lifecycle Events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self.headerCoordinator updateNavigationBarVisibilityAnimated:animated];
#if !TARGET_OS_TV
  [self.headerCoordinator updateBackButtonMenuEnabled];
#endif // !TARGET_OS_TV
  [_delegate stackScreenControllerWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_delegate stackScreenControllerDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_delegate stackScreenControllerWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_delegate stackScreenControllerDidDisappear:self];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  RNSLogD(@"[RNScreens] Screen view with tag=%ld didMoveToParentViewController %@", (long)self.view.tag, parent);
  [super didMoveToParentViewController:parent];

  if (parent == nil) {
#if !TARGET_OS_TV
    // The pop transition has completed. Clear the back button config this
    // screen has applied onto the screen below. UIKit seems to serialize
    // navigation transitions (undocumented, internal, but seems to work on 18 and 26),
    // so this runs before a queued push applies its own config.
    [_headerCoordinator clearAppliedBackButtonConfig];
#endif // !TARGET_OS_TV

    [_delegate stackScreenControllerDidLeaveStack:self];
  }
}

@end
