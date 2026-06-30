#pragma once

#import <UIKit/UIKit.h>

#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderItemSpacerDataProviding.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderContentFactory : NSObject

+ (UIBarButtonItem *)barButtonItemForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                        withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
                       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate;

+ (UIView *)wrappedViewForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                 frameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate;

+ (UIBarButtonItem *)spacerForHeaderSpacerItem:(id<RNSStackHeaderItemSpacerDataProviding>)spacer;

@end

NS_ASSUME_NONNULL_END
