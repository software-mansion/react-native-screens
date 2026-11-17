#pragma once

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSStackHeaderIconType) {
  RNSStackHeaderIconTypeSfSymbol,
  RNSStackHeaderIconTypeXcasset,
  RNSStackHeaderIconTypeImageSource,
  RNSStackHeaderIconTypeTemplateSource,
};

/**
 * Image source of `RNSStackHeaderIconTypeImageSource` / `RNSStackHeaderIconTypeTemplateSource` icons.
 */
typedef struct {
  /**
   * Loaded through `RNSImageLoading`. Opaque to `core`.
   */
  __strong id _Nullable source;

  /**
   * Size and scale the source declares, used for a placeholder until the image loads. Zero when not declared.
   */
  CGSize size;
  CGFloat scale;
} RNSStackHeaderIconImageSource;

@interface RNSStackHeaderIconData : NSObject

@property (nonatomic, readonly) RNSStackHeaderIconType iconType;
@property (nonatomic, copy, readonly, nullable) NSString *resourceName;

@property (nonatomic, readonly) RNSStackHeaderIconImageSource imageSource;

@property (nonatomic, strong, nullable) UIImage *resolvedImage;

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                resourceName:(nullable NSString *)resourceName
                 imageSource:(RNSStackHeaderIconImageSource)imageSource;

@end

NS_ASSUME_NONNULL_END
