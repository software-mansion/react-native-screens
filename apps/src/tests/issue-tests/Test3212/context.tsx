import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { ScrollEdgeEffect } from 'react-native-screens';

export interface ScrollEdgeEffects {
  bottom: ScrollEdgeEffect,
  top: ScrollEdgeEffect,
  left: ScrollEdgeEffect,
  right: ScrollEdgeEffect,
}

export interface ScrollEdgeEffectsConfigContext {
  config: ScrollEdgeEffects;
  setConfig: Dispatch<SetStateAction<ScrollEdgeEffects>>;
}

export const ScrollEdgeEffectsConfigContext =
  createContext<ScrollEdgeEffectsConfigContext | null>(null);

export const SCROLL_EDGE_EFFECT_DEFAULTS: ScrollEdgeEffects= {
  bottom: 'automatic',
  top: 'automatic',
  left: 'automatic',
  right: 'automatic',
};

export const useScrollEdgeEffectsConfigContext = () => {
  const ctx = useContext(ScrollEdgeEffectsConfigContext);

  if (!ctx) {
    throw new Error(
      'useScrollEdgeEffectsConfigContext must be used within <ScrollEdgeEffectsConfigContext.Provider>',
    );
  }

  return ctx;
};
