#import "RNSSplitScreenHeaderCoordinator.h"
#import "RCTAssert.h"
#import "RNSSplitHeaderConfigComponentView.h"
#import "RNSSplitHeaderItemComponentView.h"
#import "RNSSplitNavigationBarCoordinator.h"
#import "RNSSplitScreenComponentView.h"

#import "Swift-Bridging.h"

@implementation RNSSplitScreenHeaderCoordinator {
  __weak RNSSplitScreenController *_Nullable _screenController;

  RNSSplitNavigationBarCoordinator *_Nonnull _navigationBarCoordinator;

  // Last submitted header data — kept so bar-level configuration can be
  // (re-)applied once the controller is inside a navigation controller.
  RNSSplitHeaderData *_Nullable _lastHeaderData;
}

- (instancetype)initWithScreenController:(RNSSplitScreenController *)controller
{
  if (self = [super init]) {
    _screenController = controller;
    _navigationBarCoordinator = [RNSSplitNavigationBarCoordinator new];
  }
  return self;
}

- (RNSSplitScreenController *)requireScreenController
{
  RCTAssert(_screenController != nil, @"Screen Controller cannot be nil");
  return _screenController;
}

#pragma mark - Header Data

- (void)submitHeaderData:(nonnull RNSSplitHeaderData *)data
{
  _lastHeaderData = data;
  [self applyBarConfigurationIfNeeded:YES];
}

- (void)applyBarConfigurationIfNeeded:(BOOL)animated
{
  RNSSplitScreenController *screenController = [self requireScreenController];

  if (_lastHeaderData == nil) {
    return;
  }

  UINavigationController *navController = screenController.navigationController;
  if (navController == nil) {
    return;
  }

  [self applyNavigationItemConfiguration:_lastHeaderData forViewController:screenController];
  [_navigationBarCoordinator applyConfiguration:_lastHeaderData
                         forNavigationController:navController
                                        animated:animated];
}

#pragma mark - Navigation Item Configuration

- (void)applyNavigationItemConfiguration:(RNSSplitHeaderData *)data forViewController:(UIViewController *)vc
{
  vc.navigationItem.titleView = data.titleView;
  NSString *title = data.title;
  vc.navigationItem.title = title.length > 0 ? title : data.screenKey;

  if (@available(iOS 26.0, *)) {
    vc.navigationItem.subtitleView = data.subtitleView;
    vc.navigationItem.largeSubtitleView = data.largeSubtitleView;
  }

#if !TARGET_OS_TV
  vc.navigationItem.largeTitleDisplayMode =
      data.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
#endif

  vc.navigationItem.leftItemsSupplementBackButton = YES;
  [vc.navigationItem setLeftBarButtonItems:data.leftBarButtonItems animated:YES];
  [vc.navigationItem setRightBarButtonItems:data.rightBarButtonItems animated:YES];
}

#pragma mark - Shadow State Orchestration

- (void)updateShadowStatesToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar
{
  RNSSplitScreenComponentView *screenView =
      (RNSSplitScreenComponentView *)[self requireScreenController].splitScreenComponentView;
  RNSSplitHeaderConfigComponentView *config = [screenView findHeaderConfig];
  if (config == nil) {
    return;
  }

  [config updateShadowStateToMatchNavigationBar:navigationBar];
  for (RNSSplitHeaderItemComponentView *item in config.headerItems) {
    if (item.hasCustomView) {
      [item updateShadowStateToMatchNavigationBar:navigationBar];
    }
  }
}

@end
