//
//  RNSView.m
//  RNScreens
//
//  Created by Maciej Stosio on 08/04/2024.
//

#import "RNScreens-Bridging-Header.h"
#import "React/RCTViewManager.h"
// #import <React/RCTViewComponentView.h>

@interface RCT_EXTERN_MODULE (RNSSwiftViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(name, NSString)
@end
