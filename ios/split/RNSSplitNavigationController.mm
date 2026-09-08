#import "RNSSplitNavigationController.h"
#import "RNSSplitNavigationControllerFrameObserver.h"
#import "RNSSplitNavigationControllerFrameOriginChangeDelegate.h"

@implementation RNSSplitNavigationController {
  RNSSplitNavigationControllerFrameObserver *_frameObserver;
  id<RNSSplitNavigationControllerFrameOriginChangeDelegate> __weak _frameOriginChangeDelegate;
}

- (instancetype)initWithRootViewController:(UIViewController *)rootViewController
                 frameOriginChangeDelegate:
                     (id<RNSSplitNavigationControllerFrameOriginChangeDelegate>)frameOriginChangeDelegate
{
  if (self = [super initWithRootViewController:rootViewController]) {
    _frameOriginChangeDelegate = frameOriginChangeDelegate;
  }

  return self;
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
    _frameObserver = [[RNSSplitNavigationControllerFrameObserver alloc]
        initWithSplitNavigationController:self
                                 delegate:_frameOriginChangeDelegate];
  }
  [_frameObserver registerForViewFrameChanges];
}

- (void)dealloc
{
  [_frameObserver unregisterForViewFrameChanges];
}

@end
