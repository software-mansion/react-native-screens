#import "RNSSplitNavigationController.h"

static void *RNSSplitNavigationControllerViewFrameContext = &RNSSplitNavigationControllerViewFrameContext;

@implementation RNSSplitNavigationController {
  BOOL _isObservingViewFrame;
}

///
/// @brief Called after the view controller’s view has been loaded.
///
/// Sets up a frame-origin Key-Value Observer to monitor view position changes and propagate them via delegate to
/// RNSSplitHostController.
///
- (void)viewDidLoad
{
  [super viewDidLoad];

  if (_isObservingViewFrame) {
    [self.view removeObserver:self forKeyPath:@"frame" context:RNSSplitNavigationControllerViewFrameContext];
    _isObservingViewFrame = NO;
  }

  [self.view addObserver:self
              forKeyPath:@"frame"
                 options:NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew
                 context:RNSSplitNavigationControllerViewFrameContext];
  _isObservingViewFrame = YES;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if (context != RNSSplitNavigationControllerViewFrameContext) {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    return;
  }

  id oldValue = change[NSKeyValueChangeOldKey];
  id newValue = change[NSKeyValueChangeNewKey];
  if (![oldValue isKindOfClass:[NSValue class]] || ![newValue isKindOfClass:[NSValue class]]) {
    return;
  }

  // This cast should be safe, as only our RNSSplitNavigationControllerViewFrameContext can reach that.
  CGRect oldFrame = [oldValue CGRectValue];
  CGRect newFrame = [newValue CGRectValue];

  if (!CGPointEqualToPoint(oldFrame.origin, newFrame.origin)) {
    [self onViewOriginChange];
  }
}

- (void)onViewOriginChange
{
  [self.viewFrameOriginChangeObserver splitNavCtrlViewDidChangeFrameOrigin:self];
}

- (void)dealloc
{
  if (_isObservingViewFrame) {
    [self.viewIfLoaded removeObserver:self forKeyPath:@"frame" context:RNSSplitNavigationControllerViewFrameContext];
  }
}

@end
