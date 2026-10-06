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
@property (nonatomic, copy, readonly, nullable) NSDictionary *jsonSource;
@property (nonatomic, readonly) BOOL prefersSynchronousLoading;
@property (nonatomic, strong, nullable) UIImage *resolvedImage;

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                 resourceName:(nullable NSString *)resourceName
                   jsonSource:(nullable NSDictionary *)jsonSource
    prefersSynchronousLoading:(BOOL)prefersSynchronousLoading;

@end

NS_ASSUME_NONNULL_END
