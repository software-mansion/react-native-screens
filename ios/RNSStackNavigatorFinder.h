#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackNavigatorFinder : NSObject

/**
 * @brief Finds all UINavigationController by traversing down the hierarchy from the given UIViewController.
 *
 * It's using a common `UINavigationController` class to cover view controllers for both legacy and new native stack
 * implementation.
 *
 * @param viewController Any controller for which we want to traverse the hierarchy and return the list of
 * UINavigationControllers.
 */
+ (NSArray<UINavigationController *> *)findAllStackNavigatorControllersFrom:(UIViewController *)viewController;

@end

NS_ASSUME_NONNULL_END
