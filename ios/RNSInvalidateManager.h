#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RNSInvalidateControllerProtocol.h"

@interface RNSInvalidateManager : NSObject

+ (instancetype)sharedManager;

- (void)markForInvalidation:(UIView<RNSInvalidateControllerProtocol> *)view;
- (void)flushInvalidViews;

@end
