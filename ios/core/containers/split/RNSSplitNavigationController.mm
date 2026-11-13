#import "RNSSplitNavigationController.h"
#import "RNSSplitNavigationControllerFrameObserver.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSSplitNavigationController {
  RNSSplitNavigationControllerFrameObserver *_frameObserver;
}

/**
 * @brief Called after the view controller’s view has been loaded.
 *
 * Sets up a frame-origin Key-Value Observer to monitor view position changes and propagate them via delegate to
 * RNSSplitHostController.
 */
- (void)viewDidLoad
{
  [super viewDidLoad];

  if (_frameObserver == nil) {
    _frameObserver = [[RNSSplitNavigationControllerFrameObserver alloc] initWithSplitNavigationController:self];
  }
  [_frameObserver registerForViewFrameChanges];
}

#pragma mark - View lifecycle events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [_viewLifecycleEventsObserver viewControllerViewWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_viewLifecycleEventsObserver viewControllerViewDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_viewLifecycleEventsObserver viewControllerViewWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_viewLifecycleEventsObserver viewControllerViewDidDisappear:self];
}

- (void)dealloc
{
  [_frameObserver unregisterForViewFrameChanges];
}

@end
