//
//  RNSScreenFooter.m
//  RNScreens
//
//  Created by Kacper Kafara on 20/02/2024.
//

#import "RNSScreenFooter.h"

@implementation RNSScreenFooter

@end

@implementation RNSScreenFooterManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSScreenFooter new];
}

@end
