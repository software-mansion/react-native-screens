#pragma once

#import <React/RCTViewComponentView.h>
#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHostComponentView : RCTViewComponentView

@end

#pragma mark - Communication with StackScreen

@interface RNSStackHostComponentView ()

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
