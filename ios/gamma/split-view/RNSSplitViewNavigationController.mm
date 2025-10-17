#import "RNSSplitViewNavigationController.h"

@interface RNSSplitViewNavigationController ()
@end

@implementation RNSSplitViewNavigationController

- (void)viewDidLoad
{
  [super viewDidLoad];

  // Zarejestruj się do klasycznego KVO na właściwość "frame"
  [self.view addObserver:self
              forKeyPath:@"frame"
                 options:NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew
                 context:nil];
}

- (void)dealloc
{
  [self.view removeObserver:self forKeyPath:@"frame"];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if ([keyPath isEqualToString:@"frame"]) {
    CGRect oldFrame = [[change objectForKey:NSKeyValueChangeOldKey] CGRectValue];
    CGRect newFrame = [[change objectForKey:NSKeyValueChangeNewKey] CGRectValue];

    if (!CGPointEqualToPoint(oldFrame.origin, newFrame.origin)) {
      [self notifyViewFrameOriginChanged];
    }
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)notifyViewFrameOriginChanged
{
  if ([self.viewFrameOriginChangeObserver respondsToSelector:@selector(splitViewNavCtrlViewDidChangeFrameOrigin:)]) {
    [self.viewFrameOriginChangeObserver splitViewNavCtrlViewDidChangeFrameOrigin:self];
  }
}

@end
