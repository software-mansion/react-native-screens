#import "RNSBarSpacerView.h"

#import <react/renderer/components/RNSBarViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNSBarViewSpec/Props.h>
#import <react/renderer/components/RNSBarViewSpec/RCTComponentViewHelpers.h>

#import "BarPropHelpers.h"

#import "RNSBarView.h"

using namespace facebook::react;

@interface RNSBarView (BarInternal)
- (void)updateBarItems;
@end

@implementation RNSBarSpacerView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSBarSpacerComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSBarSpacerProps>();
    _props = defaultProps;

    self.hidden = YES;
    self.userInteractionEnabled = NO;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldSpacerProps = *std::static_pointer_cast<RNSBarSpacerProps const>(_props);
  const auto &newSpacerProps = *std::static_pointer_cast<RNSBarSpacerProps const>(props);

  APPLY_OPTIONAL_DOUBLE_PROP(self, oldSpacerProps, newSpacerProps, size);

  [super updateProps:props oldProps:oldProps];

  [self.barParent updateBarItems];
}

@end
