#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSPresentationSourceProvider : NSObject

+ (nullable UIViewController *)findViewControllerForPresentationInWindow:(nullable UIWindow *)window
                                                      ignoringController:
                                                          (nullable UIViewController *)ignoringController;

@end

NS_ASSUME_NONNULL_END
