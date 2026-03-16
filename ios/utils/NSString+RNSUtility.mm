#import "NSString+RNSUtility.h"

@implementation NSString (RNSUtility)

+ (BOOL)rnscreens_isBlankOrNull:(NSString *)string
{
  if (string == nil) {
    return YES;
  }
  return [[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length] == 0;
}

+ (BOOL)rnscreens_isEmptyOrNull:(NSString *)string
{
  if (string == nil) {
    return YES;
  }
  return [string length] == 0;
}

+ (nullable NSString *)rnscreens_stringOrNilIfBlank:(NSString *)string
{
  if ([NSString rnscreens_isBlankOrNull:string]) {
    return nil;
  }
  return string;
}

+ (nullable NSString *)rnscreens_stringOrNilIfEmpty:(NSString *)string
{
  if ([NSString rnscreens_isEmptyOrNull:string]) {
    return nil;
  }
  return string;
}

@end
