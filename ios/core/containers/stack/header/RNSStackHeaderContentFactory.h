#pragma once

#import <UIKit/UIKit.h>

#import "RNSImageLoading.h"
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
 `onIconLoaded` is called when an icon that could not be resolved synchronously has been set on the item.
 */
+ (UIBarButtonItem *)barButtonItemForHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
                        withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
                       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
                                withImageLoader:(id<RNSImageLoading>)imageLoader
                             iconLoadedCallback:(nullable void (^)(void))onIconLoaded;

/**
 Applies the current properties of `item` to a bar button item that was built for it earlier, also when the item
 gained or lost its custom view in the meantime. Properties that already have the right value are not set again.
 It does not touch the menu.
 */
+ (void)updateBarButtonItem:(UIBarButtonItem *)barButtonItem
               forHeaderItem:(id<RNSStackHeaderItemDataProviding>)item
     withFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate
    withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)headerEventsDelegate
             withImageLoader:(id<RNSImageLoading>)imageLoader
          iconLoadedCallback:(nullable void (^)(void))onIconLoaded;

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

/**
 Applies the current properties of `spacer` to a bar spacer item that was built for it earlier. Only the width of
 a fixed spacer can be changed this way: whether a spacer is fixed or flexible is decided when the bar spacer item is
 created, so for a change of the sizing the item has to be built again with `spacerForHeaderSpacerItem:`.
 */
+ (void)updateBarButtonItem:(UIBarButtonItem *)barButtonItem
        forHeaderSpacerItem:(id<RNSStackHeaderItemSpacerDataProviding>)spacer;

@end

NS_ASSUME_NONNULL_END
