#import <UIKit/UIKit.h>

@interface ObservedNavigationController : UINavigationController

@end

@interface NavigationHeightObserver : NSObject

@property (nonatomic) BOOL isObserving;

- (void)startObserving:(ObservedNavigationController *)controller;
- (void)stopObserving:(ObservedNavigationController *)controller;

@end
