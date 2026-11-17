#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackHostDelegate.h"
#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHostComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSStackHostDelegate> delegate;

@end

#pragma mark - Communication with StackScreen

@interface RNSStackHostComponentView ()

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
