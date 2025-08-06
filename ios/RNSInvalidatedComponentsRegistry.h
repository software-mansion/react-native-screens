#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RNSInvalidateControllerProtocol.h"

@interface RNSInvalidatedComponentsRegistry : NSObject

+ (instancetype)invalidatedComponentsRegistry;

- (void)pushForInvalidation:(UIView<RNSInvalidateControllerProtocol> *)view;
- (void)flushInvalidViews;

@end
