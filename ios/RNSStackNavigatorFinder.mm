#import "RNSStackNavigatorFinder.h"

static void SearchNavigationControllers(UIViewController *vc, NSMutableArray<UINavigationController *> *result)
{
  for (UIViewController *child in vc.childViewControllers) {
    if ([child isKindOfClass:[UINavigationController class]]) {
      UINavigationController *navCtrl = static_cast<UINavigationController *>(child);
      [result addObject:navCtrl];

      for (UIViewController *subCtrl in navCtrl.viewControllers) {
        SearchNavigationControllers(subCtrl, result);
      }
    } else {
      SearchNavigationControllers(child, result);
    }
  }
}

@implementation RNSStackNavigatorFinder

+ (NSArray<UINavigationController *> *)findAllStackNavigatorControllersFrom:(UIViewController *)viewController
{
  NSMutableArray<UINavigationController *> *result = [NSMutableArray array];

  SearchNavigationControllers(viewController, result);
  return result;
}

@end
