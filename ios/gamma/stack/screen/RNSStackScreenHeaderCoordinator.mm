#import "RNSStackScreenHeaderCoordinator.h"
#import "RCTAssert.h"
#import "RNSStackHeaderConfigComponentView.h"
#import "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationItemCoordinator.h"
#import "RNSStackScreenComponentView.h"
#import "RNSStackScreenController.h"

@implementation RNSStackScreenHeaderCoordinator {
  __weak RNSStackScreenController *_Nullable _screenController;

  RNSStackNavigationItemCoordinator *_Nonnull _navigationItemCoordinator;
  RNSStackNavigationBarCoordinator *_Nonnull _navigationBarCoordinator;

  // Last submitted header data — kept so bar-level configuration can be
  // (re-)applied once the controller is inside a navigation controller.
  RNSStackHeaderData *_Nullable _lastHeaderData;
}

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller
{
  if (self = [super init]) {
    _screenController = controller;
    _navigationItemCoordinator = [RNSStackNavigationItemCoordinator new];
    _navigationBarCoordinator = [RNSStackNavigationBarCoordinator new];
  }
  return self;
}

- (RNSStackScreenController *)requireScreenController
{
  RCTAssert(_screenController != nil, @"Screen Controller cannot be nil");
  return _screenController;
}

#pragma mark - Header Data

- (void)submitHeaderData:(nonnull RNSStackHeaderData *)data
{
  _lastHeaderData = data;
  [self applyBarConfigurationIfNeeded:YES];
}

- (void)applyBarConfigurationIfNeeded:(BOOL)animated
{
  RNSStackScreenController *screenController = [self requireScreenController];

  if (_lastHeaderData == nil) {
    return;
  }

  UINavigationController *navController = screenController.navigationController;
  if (navController == nil) {
    return;
  }

  [_navigationItemCoordinator applyConfiguration:_lastHeaderData forController:screenController];
  [_navigationBarCoordinator applyConfiguration:_lastHeaderData
                        forNavigationController:navController
                                       animated:animated];
}

#pragma mark - Shadow State Orchestration

- (void)updateShadowStatesToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar
{
  RNSStackScreenComponentView *screenView =
      static_cast<RNSStackScreenComponentView *>([self requireScreenController].view);
  RNSStackHeaderConfigComponentView *config = [screenView findHeaderConfig];
  if (config == nil) {
    return;
  }

  [config updateShadowStateToMatchNavigationBar:navigationBar];
  [_navigationItemCoordinator updateShadowStatesOfItems:config.headerItems inNavigationBar:navigationBar];
}

@end
