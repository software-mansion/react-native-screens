#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenComponentView;

@interface RNSStackScreenController : UIViewController

- (instancetype)initWithComponentView:(RNSStackScreenComponentView *)componentView;

@end

NS_ASSUME_NONNULL_END
