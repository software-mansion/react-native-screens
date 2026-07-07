#pragma once

#import <UIKit/UIKit.h>

#import "RNSStackHeaderEventsDelegate.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderItemSpacerDataProviding.h"
#import "RNSViewFrameChangeDelegate.h"

@class RNSStackHeaderMenuToggleStateTracker;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderContentFactory : NSObject

/**
 Builds regular bar button item to be added to the list of leading or trailing items.
 It does not define a menu, but it can be added to the resulting item separately.
 */
+ (UIBarButtonItem *)barButtonItemForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                        withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
                       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate;

/**
 Builds views that can be added to other areas of the header: titleView, subtitleView, largeSubtitleView.
 */
+ (UIView *)wrappedViewForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                 frameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate;

/**
 Builds a bar spacer item that can be added to the list of leading or trailing items
 to add separation to the items. Prior to iOS 26 it could resize the space between
 item; on iOS 26 and above, it separates the default liquid glass bubble.
 */
+ (UIBarButtonItem *)spacerForHeaderSpacerItem:(id<RNSStackHeaderItemSpacerDataProviding>)spacer;

@end

NS_ASSUME_NONNULL_END
