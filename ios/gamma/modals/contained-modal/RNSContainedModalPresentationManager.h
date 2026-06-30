#pragma once

#import <Foundation/Foundation.h>
#import "RNSContainedModalProviders.h"

@class RNSContainedModalContentController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainedModalPresentationManager : NSObject

- (void)updatePresentationIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                                    controller:(RNSContainedModalContentController *)controller;

@end

NS_ASSUME_NONNULL_END
