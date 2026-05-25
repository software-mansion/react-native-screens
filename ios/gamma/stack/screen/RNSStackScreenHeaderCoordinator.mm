#import "RNSStackScreenHeaderCoordinator.h"
#import "RCTAssert.h"
#import "RNSStackHeaderConfigComponentView.h"
#import "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackNavigationItemCoordinator.h"
#import "RNSStackScreenComponentView.h"
#import "RNSStackScreenController.h"

@implementation RNSStackScreenHeaderCoordinator {
  __weak RNSStackScreenController *_Nullable _screenController;

  RNSStackNavigationItemCoordinator *_Nonnull _navigationItemCoordinator;

  // Last submitted header data — kept so bar-level configuration can be
  // (re-)applied once the controller is inside a navigation controller.
  RNSStackHeaderData *_Nullable _lastHeaderData;
}

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller
{
  if (self = [super init]) {
    _screenController = controller;
    _navigationItemCoordinator = [RNSStackNavigationItemCoordinator new];
  }
  return self;
}

- (RNSStackScreenController *)requireScreenController
{
  RCTAssert(_screenController != nil, @"[RNScreens] Screen Controller cannot be nil");
  return _screenController;
}

- (RNSStackNavigationController *)requireNavigationController
{
  RNSStackScreenController *screenController = [self requireScreenController];
  UINavigationController *navController = screenController.navigationController;
  RCTAssert(navController != nil, @"[RNScreens] NavigationController should be initialized at this point");
  RCTAssert([navController isKindOfClass:RNSStackNavigationController.class],
            @"[RNScreens] NavigationController should be instance of RNSStackNavigationController");
  return (RNSStackNavigationController *)navController;
}

#pragma mark - Header Data

- (void)submitHeaderData:(nonnull RNSStackHeaderData *)data
{
  _lastHeaderData = data;
  [self applyBarConfigurationIfNeeded:YES];
}

- (void)applyBarConfigurationIfNeeded:(BOOL)animated
{
  if (_lastHeaderData == nil) {
    return;
  }

  RNSStackScreenController *screenController = [self requireScreenController];
  RNSStackNavigationController *navController = [self requireNavigationController];

  [_navigationItemCoordinator applyConfiguration:_lastHeaderData forController:screenController];
  [navController.navigationBarCoordinator applyConfiguration:_lastHeaderData
                                     forNavigationController:navController
                                                    animated:animated];
}

@end
