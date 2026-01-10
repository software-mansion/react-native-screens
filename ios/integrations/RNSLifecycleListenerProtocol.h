#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSLifecycleListenerProtocol <NSObject>

// Called when a screen in the presenting hierarchy is about to disappear.
// @param screen The screen controller that is disappearing
// @param isPresenterUnmounting YES if the presenter (modal) itself is being unmounted
- (void)screenWillDisappear:(UIViewController *)screen isPresenterUnmounting:(BOOL)isPresenterUnmounting;

@end

NS_ASSUME_NONNULL_END
