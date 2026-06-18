#pragma once

#import <Foundation/Foundation.h>

typedef NS_OPTIONS(NSUInteger, RNSContainedModalUpdateFlags) {
  RNSContainedModalUpdateFlagsNone = 0,
  // The modal needs to be presented or dismissed to match the requested open state.
  RNSContainedModalUpdateFlagsPresentation = 1 << 0,
  // The modals's visual appearance configuration needs to be re-applied.
  RNSContainedModalUpdateFlagsAppearance = 1 << 1,
  // The modal's behavioral layout needs to be re-applied.
  RNSContainedModalUpdateFlagsBehavior = 1 << 2,
};
