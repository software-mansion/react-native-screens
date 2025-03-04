@implementation NSString (RNSStringUtil)

+ (BOOL)RNSisBlank:(NSString *)string
{
  if (string == nil) {
    return YES;
  }
  return [[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length] == 0;
}

@end
