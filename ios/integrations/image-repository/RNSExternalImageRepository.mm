#import "RNSExternalImageRepository.h"
#import <React/RCTAssert.h>
#import "RNSExternalImageRepository+Internal.h"

@implementation RNSExternalImageRepository {
  NSMutableDictionary<NSString *, UIImage *> *_imageRegistry;
  NSMutableDictionary<NSString *, ImageCallback> *_callbackRegistry;
}

+ (instancetype)sharedInstance
{
  static RNSExternalImageRepository *instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    instance = [RNSExternalImageRepository new];
  });

  return instance;
}

- (BOOL)insertImage:(nullable UIImage *)image forKey:(nonnull NSString *)key
{
  RCTAssert(key != nil, @"[RNScreens] Nullish key on attempt to insert image: %@ to the registry", image);

  if ([[self requireStorage] objectForKey:key]) {
    return NO;
  }

  [[self requireStorage] setObject:image forKey:key];
  _Nullable ImageCallback imageCallback = [[self requireCallbackRegistry] valueForKey:key];
  if (imageCallback != nil) {
    imageCallback(key, image);
  }
  return YES;
}

- (nullable UIImage *)imageForKey:(nonnull NSString *)key
{
  return [[self requireStorage] objectForKey:key];
}

- (BOOL)removeImageForKey:(nonnull NSString *)key
{
  if ([[self requireStorage] objectForKey:key]) {
    [[self requireStorage] removeObjectForKey:key];
    return YES;
  }
  return NO;
}

- (nullable UIImage *)imageForKey:(nonnull NSString *)key withInsertionCallback:(ImageCallback)callback
{
  UIImage *image = [self imageForKey:key];

  if (image != nil) {
    return image;
  }

  if (callback == nil) {
    return nil;
  }

  if ([[self requireCallbackRegistry] objectForKey:key]) {
    RCTAssert(NO, @"[RNScreens] A callback is already registered for image with key: %@", key);
    return nil;
  }

  [[self requireCallbackRegistry] setValue:callback forKey:key];
  return nil;
}

- (NSMutableDictionary *)requireStorage
{
  if (_imageRegistry == nil) {
    _imageRegistry = [NSMutableDictionary new];
  }
  return _imageRegistry;
}

- (NSMutableDictionary *)requireCallbackRegistry
{
  if (_callbackRegistry == nil) {
    _callbackRegistry = [NSMutableDictionary new];
  }
  return _callbackRegistry;
}

@end
