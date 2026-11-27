#import "RNSStackScreenController.h"
#import "RNSContainer.h"
#import "RNSContainerItemSupport.h"
#import "RNSLog.h"
#import "RNSStackScreenHeaderCoordinator.h"

@implementation RNSStackScreenController {
  RNSContainerItemSupport *_Nonnull _containerItemSupport;
}

- (instancetype)init
{
  if (self = [super init]) {
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
  return [_containerItemSupport findContentScrollViewWithCachedScrollView:[_configProvider cachedContentScrollView]
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
  [_delegate viewControllerViewWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_delegate viewControllerViewDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_delegate viewControllerViewWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_delegate viewControllerViewDidDisappear:self];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  RNSLogD(@"[RNScreens] Screen view with tag=%ld didMoveToParentViewController %@", (long)self.view.tag, parent);
  [super didMoveToParentViewController:parent];

  if (parent == nil) {
    [_delegate stackScreenControllerDidLeaveStack:self];
  }
}

@end
