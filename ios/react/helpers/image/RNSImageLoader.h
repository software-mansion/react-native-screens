#pragma once

#import <UIKit/UIKit.h>
#import "RNSImageLoading.h"

@class RCTImageLoader;

NS_ASSUME_NONNULL_BEGIN

/**
 * The `RNSImageLoading` implementation shared by the hosts that hand an image loader to `core`.
 *
 * Accepts `RCTImageSource` objects and JSON image sources from props (anything `+[RCTConvert RCTImageSource:]`
 * converts). The owner sets `reactImageLoader` once it gets one from its state, and keeps this object alive: `core`
 * holds it weakly.
 */
@interface RNSImageLoader : NSObject <RNSImageLoading>

@property (nonatomic, strong, nullable) RCTImageLoader *reactImageLoader;

@end

NS_ASSUME_NONNULL_END
