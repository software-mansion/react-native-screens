#import "RNSStackScreenHeaderCoordinator.h"
#import "RCTAssert.h"
#import "RNSLog.h"
#import "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackNavigationItemCoordinator.h"
#import "RNSStackScreenComponentView.h"
#import "RNSStackScreenController.h"

@implementation RNSStackScreenHeaderCoordinator {
  __weak RNSStackScreenController *_Nullable _screenController;

  RNSStackNavigationItemCoordinator *_Nonnull _navigationItemCoordinator;

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

- (RNSStackNavigationController *)getNavigationController
{
  RNSStackScreenController *screenController = [self requireScreenController];
  UINavigationController *navController = screenController.navigationController;
  if (navController == nil) {
    return nil;
  }

  RCTAssert([navController isKindOfClass:RNSStackNavigationController.class],
            @"[RNScreens] NavigationController should be instance of RNSStackNavigationController");
  return (RNSStackNavigationController *)navController;
}

#pragma mark - Header Data

- (void)submitHeaderData:(nonnull RNSStackHeaderData *)data
{
  _lastHeaderData = data;

  RNSStackScreenController *screenController = [self requireScreenController];
  [_navigationItemCoordinator applyConfiguration:data forController:screenController];

  RNSStackNavigationController *navController = [self getNavigationController];
  if (navController != nil) {
    [navController.navigationBarCoordinator applyConfiguration:data forNavigationController:navController animated:YES];
  }
}

- (void)clearHeaderConfiguration
{
  [self submitHeaderData:[RNSStackHeaderData empty]];
}

@end
