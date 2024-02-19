//
//  ScreenSrollableContentWrapper.m
//  RNScreens
//
//  Created by Kacper Kafara on 01/02/2024.
//

#import "ScreenSrollableContentWrapper.h"

@implementation ScreenSrollableContentWrapper

- (void)layoutSubviews
{
  [super layoutSubviews];
  if (self.onLayout != nil) {
    self.onLayout(self.frame);
  }
}

@end
