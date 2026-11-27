#import "RNSStackNavigationControllerDelegate.h"
#import "RNSStackTransition.h"

@implementation RNSStackNavigationControllerDelegate

- (nullable id<UIViewControllerAnimatedTransitioning>)navigationController:
                                                          (UINavigationController *)navigationController
                                           animationControllerForOperation:(UINavigationControllerOperation)operation
                                                        fromViewController:(UIViewController *)fromVC
                                                          toViewController:(UIViewController *)toVC
{
  // UIKit's default animation. Custom transitions read `currentTransition` here.
  return nil;
}

- (void)navigationController:(UINavigationController *)navigationController
       didShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animated
{
  _currentTransition = nil;
}

@end
