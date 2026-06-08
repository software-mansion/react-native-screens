#pragma once

#import <UIKit/UIKit.h>

#import "RNSStackHeaderItemDataProviding.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemCoordinator : NSObject

+ (UIBarButtonItem *)barButtonItemForItem:(id<RNSStackHeaderItemDataProviding>)item
                  withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate;

+ (UIView *)wrappedViewForItem:(id<RNSStackHeaderItemDataProviding>)item
           frameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END
