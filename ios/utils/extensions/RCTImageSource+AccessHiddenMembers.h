#pragma once

#import <React/RCTImageSource.h>

// This field should exist in extension in `RCTImageSource.m`

@interface RCTImageSource (AccessHiddenMembers)

@property (nonatomic, assign) BOOL packagerAsset;

@end
