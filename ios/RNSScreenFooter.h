//
//  RNSScreenFooter.h
//  RNScreens
//
//  Created by Kacper Kafara on 20/02/2024.
//

#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RCTView.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^OnLayoutCallback)(CGRect frame);

@interface RNSScreenFooter : RCTView

@property (nonatomic, copy, nullable) OnLayoutCallback onLayout;

@end

@interface RNSScreenFooterManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
