#import "RNSStackHeaderData.h"

@implementation RNSStackHeaderData

- (instancetype)initWithTitle:(nullable NSString *)title
                     subtitle:(nullable NSString *)subtitle
                    screenKey:(nullable NSString *)screenKey
                       hidden:(BOOL)hidden
                   largeTitle:(BOOL)largeTitle
           leftBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)leftBarButtonItems
          rightBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)rightBarButtonItems
                    titleView:(nullable UIView *)titleView
                 subtitleView:(nullable UIView *)subtitleView
            largeSubtitleView:(nullable UIView *)largeSubtitleView
{
  if (self = [super init]) {
    _title = [title copy];
    _subtitle = [subtitle copy];
    _screenKey = [screenKey copy];
    _hidden = hidden;
    _largeTitle = largeTitle;
    _leftBarButtonItems = [leftBarButtonItems copy];
    _rightBarButtonItems = [rightBarButtonItems copy];
    _titleView = titleView;
    _subtitleView = subtitleView;
    _largeSubtitleView = largeSubtitleView;
  }
  return self;
}

@end
