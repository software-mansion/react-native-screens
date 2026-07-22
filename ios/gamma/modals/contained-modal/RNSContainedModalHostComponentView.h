#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainedModalHostComponentView : RNSReactBaseView

@end

#pragma mark - Props

@interface RNSContainedModalHostComponentView ()

@property (nonatomic, readonly) BOOL isOpen;
@property (nonatomic, copy, readonly, nullable) NSString *targetContainerId;
@property (nonatomic, readonly) BOOL transparent;

@end

NS_ASSUME_NONNULL_END
