#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>

@interface RNSImageLoadingHelper : NSObject

+ (void)loadImageSyncIfPossibleFromJsonSource:(nonnull id)jsonImageSource
                              withImageLoader:(nonnull RCTImageLoader *)imageLoader
                                   asTemplate:(BOOL)isTemplate
               synchronouslyInDebugIfPossible:(BOOL)shouldLoadSynchronouslyInDebug
                              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

+ (void)loadImageFromSource:(nonnull RCTImageSource *)imageSource
            withImageLoader:(nonnull RCTImageLoader *)imageLoader
                 asTemplate:(BOOL)isTemplate
    synchronouslyIfPossible:(BOOL)shouldLoadSynchronously
            completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

@end
