#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSContainer;

/**
 * Composition holder for the `RNSContainer` side of the container-nesting mechanism.
 *
 * On attach it walks the view-controller hierarchy upwards to find the nearest parent
 * `RNSContainerItem` and registers the container with it; on detach it unregisters the container
 * from the remembered parent item. The parent item is held weakly.
 */
@interface RNSParentContainerItemRegistry : NSObject

- (void)attachContainer:(UIViewController<RNSContainer> *)container;

- (void)detachContainer:(UIViewController<RNSContainer> *)container;

@end

NS_ASSUME_NONNULL_END
