#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHostComponentView : RNSReactBaseView

@end

#pragma mark - Props

@interface RNSStackHostComponentView ()

@property (nonatomic, readonly) UITraitEnvironmentLayoutDirection layoutDirection;

@end

#pragma mark - Communication with StackScreen

@interface RNSStackHostComponentView ()

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
