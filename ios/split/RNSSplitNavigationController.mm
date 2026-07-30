#import "RNSSplitNavigationController.h"
#import "RNSSplitNavigationControllerFrameObserver.h"
#import "RNSViewFrameOriginChangeDelegate.h"

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

- (void)viewFrameOriginDidChange
{
  [self.viewFrameOriginChangeDelegate viewFrameOriginDidChange:self];
}

- (void)dealloc
{
  [_frameObserver unregisterForViewFrameChanges];
}

@end
