#import "RNSInlineModalProviderComponentView.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>

using namespace facebook::react;

@interface RNSInlineModalProviderController : UIViewController
@end

@implementation RNSInlineModalProviderController

- (instancetype)init
{
  if (self = [super init]) {
    self.definesPresentationContext = YES;
  }
  return self;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
  view.backgroundColor = [UIColor clearColor];
  self.view = view;
}

@end

@implementation RNSInlineModalProviderComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSInlineModalProviderProps>();
    _props = defaultProps;

    _contextViewController = [[RNSInlineModalProviderController alloc] init];
    [self addSubview:_contextViewController.view];
  }
  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _contextViewController.view.frame = self.bounds;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSInlineModalProviderComponentDescriptor>();
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_contextViewController.view insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

@end

Class<RCTComponentViewProtocol> RNSInlineModalProviderCls(void)
{
  return RNSInlineModalProviderComponentView.class;
}
