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

@interface RNSStackHeaderIconData : NSObject

@property (nonatomic, readonly) RNSStackHeaderIconType iconType;
@property (nonatomic, copy, readonly, nullable) NSString *resourceName;

/**
 * Image source of `RNSStackHeaderIconTypeImageSource` / `RNSStackHeaderIconTypeTemplateSource` icons, loaded through
 * `RNSImageLoading`. Opaque: whoever creates the icon data also provides the loader.
 */
@property (nonatomic, strong, readonly, nullable) id imageSource;

/**
 * Size and scale the image source declares, used for a placeholder until the image loads. Zero when not declared.
 */
@property (nonatomic, readonly) CGSize imageSourceSize;
@property (nonatomic, readonly) CGFloat imageSourceScale;

@property (nonatomic, strong, nullable) UIImage *resolvedImage;

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                resourceName:(nullable NSString *)resourceName
                 imageSource:(nullable id)imageSource
             imageSourceSize:(CGSize)imageSourceSize
            imageSourceScale:(CGFloat)imageSourceScale;

@end

NS_ASSUME_NONNULL_END
