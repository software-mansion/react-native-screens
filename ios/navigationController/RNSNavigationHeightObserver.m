#import "RNSNavigationHeightObserver.h"

@implementation ObservedNavigationController

@end

@implementation NavigationHeightObserver

- (void)startObserving:(ObservedNavigationController *)controller
{
  if (self.isObserving) {
    return;
  }

  [controller.navigationBar addObserver:self
                             forKeyPath:@"frame"
                                options:NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew
                                context:nil];
  [[UIApplication sharedApplication] addObserver:self
                                      forKeyPath:@"statusBarFrame"
                                         options:NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew
                                         context:nil];
  self.isObserving = YES;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  if ([keyPath isEqualToString:@"frame"] || [keyPath isEqualToString:@"statusBarFrame"]) {
    CGFloat statusBarHeight = [UIApplication sharedApplication].statusBarFrame.size.height;
    CGFloat navigationBarHeight = ((UINavigationBar *)object).frame.size.height;
    CGFloat totalHeaderHeight = statusBarHeight + navigationBarHeight;

    NSLog(@"Total header height: %f", totalHeaderHeight);
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (void)stopObserving:(ObservedNavigationController *)controller
{
  if (!self.isObserving) {
    return;
  }

  [controller.navigationBar removeObserver:self forKeyPath:@"frame"];
  [[UIApplication sharedApplication] removeObserver:self forKeyPath:@"statusBarFrame"];
  self.isObserving = NO;
}

@end
