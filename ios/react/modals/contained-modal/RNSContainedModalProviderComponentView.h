#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainedModalContextProviding.h"
#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainedModalProviderComponentView : RNSReactBaseView <RNSContainedModalContextProviding>

@end

NS_ASSUME_NONNULL_END
