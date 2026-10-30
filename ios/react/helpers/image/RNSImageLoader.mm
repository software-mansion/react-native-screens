#import "RNSImageLoader.h"
#import <React/RCTConvert.h>
#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>
#import "RNSImageLoadingHelper.h"
#import "RNSLog.h"

@implementation RNSImageLoader

#pragma mark - RNSImageLoading

- (void)loadImageFromSource:(id)source
                 asTemplate:(BOOL)isTemplate
     withCompletionCallback:(void (^)(UIImage *_Nullable image))completionBlock
{
  if (_reactImageLoader == nil) {
    RNSLogW(@"[RNScreens] Unable to load an image: the React image loader is not available yet");
    completionBlock(nil);
    return;
  }

  RCTImageSource *imageSource = [source isKindOfClass:RCTImageSource.class] ? static_cast<RCTImageSource *>(source)
                                                                            : [RCTConvert RCTImageSource:source];
  if (imageSource == nil) {
    RNSLogE(@"[RNScreens] Expected an image source, got %@", source);
    completionBlock(nil);
    return;
  }

  [RNSImageLoadingHelper loadImageFromSource:imageSource
                             withImageLoader:_reactImageLoader
                                  asTemplate:isTemplate
                             completionBlock:completionBlock];
}

- (nullable UIImage *)symbolImageNamed:(NSString *)name
{
  return [RNSImageLoadingHelper symbolImageNamed:name];
}

@end
