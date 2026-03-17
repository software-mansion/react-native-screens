#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenComponentView;
@class RNSStackController;

@interface RNSStackScreenController : UIViewController

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *screen;

- (instancetype)initWithComponentView:(RNSStackScreenComponentView *)componentView;

@end

NS_ASSUME_NONNULL_END
