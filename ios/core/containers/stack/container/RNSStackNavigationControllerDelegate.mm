#import "RNSStackNavigationControllerDelegate.h"

@implementation RNSStackNavigationControllerDelegate

- (nullable id<UIViewControllerAnimatedTransitioning>)navigationController:
                                                          (UINavigationController *)navigationController
                                           animationControllerForOperation:(UINavigationControllerOperation)operation
                                                        fromViewController:(UIViewController *)fromVC
                                                          toViewController:(UIViewController *)toVC
{
  return nil;
}

@end
