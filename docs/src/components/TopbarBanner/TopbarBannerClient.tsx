import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  BANNER_REVEAL_EASING,
  BANNER_REVEAL_MS,
  type BannerZone,
  cacheKey,
  MIN_VISIBLE_HEIGHT,
  varNames,
} from './shared';

export type { BannerZone };

const DEFAULT_ROTATE_INTERVAL_MS = 4000;
const SLIDE_MS = 700;

const rotateLeft = <T,>(arr: T[], k: number): T[] =>
  arr.slice(k).concat(arr.slice(0, k));
const rotateRight = <T,>(arr: T[], k: number): T[] =>
  arr.slice(arr.length - k).concat(arr.slice(0, arr.length - k));

const SCRIPT_SRC = 'https://swm-delivery.com/www/assets/js/lib.js';

const FALLBACK_BG_COLOR = '#2a47ff';

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Cache only the banner's layout (height + bg), never banner content.
// Revive reloads the live banner every time for its own tracking/rotation; this just
// lets the bar be reserved at the right size before the live load arrives.
// Wait this long for the live banner before treating the slot as empty...
const BANNER_SETTLE_MS = 4000;
// ...unless Revive already signalled done (data-content-loaded), then this.
const BANNER_CONFIRM_MS = 500;

type TopbarBannerCache = { height: number; bgColor: string; timestamp: number };

const writeCache = (key: string, height: number, bgColor: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const entry: TopbarBannerCache = { height, bgColor, timestamp: Date.now() };
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // best-effort
  }
};

const clearCache = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    // best-effort
  }
};

// Null height clears the reservation (bar collapses via the var fallback).
const setReservation = (
  vars: { height: string; bg: string },
  height: number | null,
  bgColor?: string
) => {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  if (height === null) {
    root.style.removeProperty(vars.height);
  } else {
    root.style.setProperty(vars.height, `${height}px`);
  }
  if (bgColor) {
    root.style.setProperty(vars.bg, bgColor);
  }
};

const isTransparent = (color: string) =>
  !color ||
  color === 'transparent' ||
  /^rgba?\([^)]*,\s*0\s*\)$/.test(color.replace(/\s+/g, ' '));

const findOpaqueBg = (nodes: HTMLElement[]): string | null => {
  for (const node of nodes) {
    const bg = getComputedStyle(node).backgroundColor;
    if (!isTransparent(bg)) {
      return bg;
    }
  }
  return null;
};

// Walk loaded banner DOM, return first opaque background-color.
// Revive serves banner inside an iframe, so descend into accessible
// (same-origin) iframe documents too; cross-origin access throws → skip.
const extractBgColor = (root: HTMLElement): string | null => {
  const direct = findOpaqueBg([
    root,
    ...Array.from(root.querySelectorAll<HTMLElement>('*')),
  ]);
  if (direct) {
    return direct;
  }

  for (const frame of Array.from(root.querySelectorAll('iframe'))) {
    try {
      const doc = frame.contentDocument;
      if (!doc?.body) {
        continue;
      }
      const fromFrame = findOpaqueBg([
        doc.body,
        ...Array.from(doc.body.querySelectorAll<HTMLElement>('*')),
      ]);
      if (fromFrame) {
        return fromFrame;
      }
    } catch {
      // Cross-origin iframe — cannot read; keep fallback.
    }
  }
  return null;
};

/** Per-zone measured state lifted to the rotating parent. */
type ZoneState = { height: number; hasBanner: boolean };

interface BannerZoneSlotProps {
  zone: BannerZone;
  /** This slot's index in the parent's zone list. */
  index: number;
  /**
   * Reports this zone's measured height + fill state to the parent. Must be a
   * stable reference (the reconcile effect depends on it) — pass the parent's
   * memoized handler directly, not an inline closure.
   */
  onChange: (index: number, state: ZoneState) => void;
}

/**
 * Single Revive slot: owns its own detection observer, cache, and per-instance
 * CSS-var reservation (height + bg), exactly as the original single-zone
 * TopbarBanner did. It reports {@link ZoneState} up so the parent can drive the
 * rotating bar's height and slide offset. The `<ins>` mounts immediately so
 * every zone's banner loads in the background and warms its own cache.
 */
const BannerZoneSlot = ({ zone, index, onChange }: BannerZoneSlotProps) => {
  const fallbackBgColor = zone.fallbackBgColor ?? FALLBACK_BG_COLOR;
  const contentRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement | null>(null);

  const keyRef = useRef(cacheKey(zone.zoneId, zone.contentId));
  const varsRef = useRef(varNames(zone.zoneId, zone.contentId));

  const [hasBanner, setHasBanner] = useState(false);
  // Revive finished the slot (filled or empty) then can collapse an empty one fast.
  const [reviveDone, setReviveDone] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const getIns = () => {
      const current = content.querySelector('ins');
      if (current && current !== insRef.current) {
        insRef.current = current;
      }
      return insRef.current;
    };

    const detectBanner = () => {
      const height = Math.max(content.scrollHeight, content.offsetHeight);
      return height >= MIN_VISIBLE_HEIGHT;
    };

    const updateState = () => {
      setHasBanner(detectBanner());
      // Revive stamps data-content-loaded="1" when done, even for an empty slot.
      if (getIns()?.getAttribute('data-content-loaded') === '1') {
        setReviveDone(true);
      }
    };

    const containerObserver = new MutationObserver(updateState);
    containerObserver.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const ins = getIns();
    let insObserver: MutationObserver | null = null;
    if (ins) {
      insObserver = new MutationObserver(updateState);
      insObserver.observe(ins, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-content-loaded', 'style', 'class', 'id'],
      });
    }

    updateState();

    return () => {
      containerObserver.disconnect();
      if (insObserver) {
        insObserver.disconnect();
      }
    };
  }, []);

  // Reconcile the live banner against the reserved size, then persist.
  useEffect(() => {
    if (hasBanner) {
      const content = contentRef.current;
      if (!content) {
        return;
      }

      // Sync reservation + cache to the live size (no-op when it matches the
      // warm value; a mismatch tweens via the height transition).
      const raf = requestAnimationFrame(() => {
        // The <ins> is a shrink-to-fit flex item; without a definite width the
        // iframe's `width:100%` resolves circularly and collapses to the 300px
        // replaced-element default. Stretch the <ins> to full bar width first,
        // then the iframe's 100% has a real containing block to fill.
        const ins = content.querySelector('ins');
        if (ins) {
          ins.style.display = 'block';
          ins.style.width = '100%';
        }
        const iframe = content.querySelector('iframe');
        if (iframe) {
          iframe.style.display = 'block';
          iframe.style.width = '100%';
          iframe.style.maxWidth = '100%';
        }
        const height = Math.max(content.scrollHeight, content.offsetHeight);
        const bg = extractBgColor(content) ?? fallbackBgColor;
        setReservation(varsRef.current, height, bg);
        writeCache(keyRef.current, height, bg);
        onChange(index, { height, hasBanner: true });
      });
      return () => cancelAnimationFrame(raf);
    }

    // No banner yet: a real one arriving flips hasBanner and cancels this;
    // otherwise, once it's confirmed empty, collapse + drop the cache.
    const delay = reviveDone ? BANNER_CONFIRM_MS : BANNER_SETTLE_MS;
    const settle = window.setTimeout(() => {
      const content = contentRef.current;
      if (!content) {
        return;
      }
      const height = Math.max(content.scrollHeight, content.offsetHeight);
      if (height < MIN_VISIBLE_HEIGHT) {
        clearCache(keyRef.current);
        setReservation(varsRef.current, null);
        onChange(index, { height: 0, hasBanner: false });
      }
    }, delay);
    return () => window.clearTimeout(settle);
  }, [hasBanner, reviveDone, fallbackBgColor, onChange, index]);

  return (
    <div
      ref={contentRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: hasBanner ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}
      suppressHydrationWarning>
      <ins
        data-content-zoneid={zone.zoneId}
        data-content-id={zone.contentId}
        style={{ display: 'block' }}
        suppressHydrationWarning
      />
    </div>
  );
};

export interface TopbarBannerProps {
  /**
   * Zones to rotate through. When omitted, falls back to the single-zone
   * {@link TopbarBannerProps.zoneId}/{@link TopbarBannerProps.contentId} props.
   */
  zones?: BannerZone[];
  /** Single-zone shorthand (back-compat). Ignored when `zones` is provided. */
  zoneId?: string;
  /** Single-zone shorthand (back-compat). Ignored when `zones` is provided. */
  contentId?: string;
  /** Bar color for the single-zone shorthand. */
  fallbackBgColor?: string;
  /** Called with the active zone's measured height (px), or 0 when empty. */
  setBannerHeight?: (height: number) => void;
  /**
   * Rotation interval in ms — time the active banner is held before the next
   * slide starts. Defaults to 1000. Floored at the slide duration ({@link
   * SLIDE_MS}) so ticks aren't silently dropped mid-slide. Single zone never
   * rotates.
   */
  rotateIntervalMs?: number;
  /**
   * Slide direction. `"up"` (default) slides each banner upward and pulls the
   * next in from below; `"down"` slides downward, pulling from above. Rotation
   * is always continuous in one direction — never bounces back.
   */
  direction?: 'up' | 'down';
}

// Slider view: which zone slot sits where (`order`), the current translate
// (`offset`, px), whether that translate animates, and the zone driving the
// bar height/bg (`active`).
type SliderView = {
  order: number[];
  offset: number;
  animate: boolean;
  active: number;
};

/**
 * Revive Adserver banner in a collapsible top bar, rotating through one or more
 * {@link BannerZone}s. Each zone's height/bg are driven by per-instance CSS vars
 * (not React state) so {@link topbarBannerReservationScript} can reserve the first
 * zone's cached size in the layout `<head>` before hydration — see that function
 * and the warm-cache note above for the no-content-shift rationale.
 *
 * Rotation is a vertical slide (rotator-style): zone slots share one slider and
 * the visible one is chosen via CSS flex `order` (DOM order stays fixed so the
 * Revive iframes are never moved/reloaded), while the bar height tweens to the
 * active zone. Empty zones are skipped while rotating.
 */
export const TopbarBanner = ({
  zones,
  zoneId,
  contentId,
  fallbackBgColor = FALLBACK_BG_COLOR,
  setBannerHeight,
  rotateIntervalMs = DEFAULT_ROTATE_INTERVAL_MS,
  direction = 'up',
}: TopbarBannerProps) => {
  const normalizedZones: BannerZone[] =
    zones && zones.length > 0
      ? zones
      : zoneId && contentId
        ? [{ zoneId, contentId, fallbackBgColor }]
        : [];

  const [zoneStates, setZoneStates] = useState<ZoneState[]>(() =>
    normalizedZones.map(() => ({ height: 0, hasBanner: false }))
  );
  const [view, setView] = useState<SliderView>(() => ({
    order: normalizedZones.map((_, i) => i),
    offset: 0,
    animate: false,
    active: 0,
  }));
  // Off until after first paint so a pre-reserved bar doesn't animate on load.
  const [animateIn, setAnimateIn] = useState(false);
  // True once at least one zone has reported. Gates the global `bannerLoaded`
  // flag so it isn't stamped "false" on mount before any zone has settled.
  const [anyReported, setAnyReported] = useState(false);

  // Latest values the rotation timer reads without re-arming on every update.
  const zoneStatesRef = useRef(zoneStates);
  zoneStatesRef.current = zoneStates;
  const viewRef = useRef(view);
  viewRef.current = view;
  const directionRef = useRef(direction);
  directionRef.current = direction;
  // True while a slide is mid-flight, so ticks can't overlap.
  const busyRef = useRef(false);

  const handleZoneChange = useCallback((i: number, state: ZoneState) => {
    setAnyReported(true);
    setZoneStates((prev) => {
      const cur = prev[i];
      // Bail when nothing changed so a steadily-filled slot doesn't spin the
      // reconcile rAF → setState → re-render loop every animation frame.
      if (
        cur &&
        cur.height === state.height &&
        cur.hasBanner === state.hasBanner
      ) {
        return prev;
      }
      const next = prev.slice();
      next[i] = state;
      return next;
    });
  }, []);

  // Inject the Revive loader once; it drives every zone's <ins>.
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_SRC;
    document.body.appendChild(script);
  }, []);

  // Arm transition only after the first frame is painted (double rAF), so the
  // reserved bar appears instantly but later size changes still animate.
  useIsoLayoutEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimateIn(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // One rotation step. Slides in a single direction and then re-homes the slot
  // order so the loop is seamless (never bounces back at the wrap). Empty zones
  // are skipped. Returns timer/raf ids the interval can cancel on cleanup.
  useEffect(() => {
    if (normalizedZones.length <= 1) {
      return;
    }

    let pendingTimer = 0;
    let pendingRaf = 0;

    const step = () => {
      if (busyRef.current) {
        return;
      }
      const v = viewRef.current;
      const n = v.order.length;
      const states = zoneStatesRef.current;
      const heights = v.order.map((zi) => states[zi]?.height ?? 0);

      if (directionRef.current === 'down') {
        // Pull the previous banner zone in from above.
        let j = 0;
        for (let s = 1; s < n; s++) {
          if (states[v.order[(n - s) % n]]?.hasBanner) {
            j = s;
            break;
          }
        }
        if (j === 0) {
          return;
        }
        const newOrder = rotateRight(v.order, j);
        const moving = heights.slice(n - j).reduce((sum, h) => sum + h, 0);
        const active = newOrder[0];
        busyRef.current = true;
        // Place the incoming slot just above the viewport, then slide it down.
        setView({ order: newOrder, offset: -moving, animate: false, active });
        pendingRaf = requestAnimationFrame(() => {
          pendingRaf = requestAnimationFrame(() => {
            setView({ order: newOrder, offset: 0, animate: true, active });
            pendingTimer = window.setTimeout(() => {
              busyRef.current = false;
            }, SLIDE_MS);
          });
        });
        return;
      }

      // up: push the active slot out the top, pull the next in from below.
      let k = 0;
      for (let s = 1; s < n; s++) {
        if (states[v.order[s]]?.hasBanner) {
          k = s;
          break;
        }
      }
      if (k === 0) {
        return;
      }
      const moving = heights.slice(0, k).reduce((sum, h) => sum + h, 0);
      const active = v.order[k];
      busyRef.current = true;
      setView({ order: v.order, offset: -moving, animate: true, active });
      pendingTimer = window.setTimeout(() => {
        // Re-home: rotate so the now-visible slot is first, reset the offset.
        setView({
          order: rotateLeft(v.order, k),
          offset: 0,
          animate: false,
          active,
        });
        busyRef.current = false;
      }, SLIDE_MS);
    };

    // Floor at SLIDE_MS: a tick during an in-flight slide is dropped by the
    // busy guard, so a shorter interval just wastes ticks instead of rotating
    // faster. Holding for the slide duration keeps the cadence honest.
    const interval = Math.max(rotateIntervalMs, SLIDE_MS);
    const id = window.setInterval(step, interval);
    return () => {
      window.clearInterval(id);
      if (pendingTimer) {
        window.clearTimeout(pendingTimer);
      }
      if (pendingRaf) {
        cancelAnimationFrame(pendingRaf);
      }
      busyRef.current = false;
    };
  }, [normalizedZones.length, rotateIntervalMs]);

  // Report the active zone height + global loaded flag. Held until at least one
  // zone reports so the flag isn't stamped "false" before any zone has settled.
  useEffect(() => {
    if (typeof document === 'undefined' || !anyReported) {
      return;
    }
    const anyBanner = zoneStates.some((s) => s.hasBanner);
    document.documentElement.dataset.bannerLoaded = anyBanner
      ? 'true'
      : 'false';
    setBannerHeight?.(zoneStates[view.active]?.height ?? 0);
  }, [zoneStates, view.active, setBannerHeight, anyReported]);

  if (normalizedZones.length === 0) {
    return null;
  }

  const activeZone = normalizedZones[view.active] ?? normalizedZones[0];
  const activeVars = varNames(activeZone.zoneId, activeZone.contentId);
  const activeFallback = activeZone.fallbackBgColor ?? FALLBACK_BG_COLOR;

  // Visual stacking position per zone. DOM order stays fixed (so Revive's
  // iframes are never moved — moving an iframe reloads it); only the CSS flex
  // `order` reshuffles, which the slide + re-home rely on.
  const slotOrder: number[] = [];
  view.order.forEach((zi, pos) => {
    slotOrder[zi] = pos;
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        transition: animateIn
          ? `height ${BANNER_REVEAL_MS}ms ${BANNER_REVEAL_EASING}, background 200ms ease-out`
          : 'none',
        height: `var(${activeVars.height}, 0px)`,
        overflow: 'hidden',
        willChange: 'height',
        // `background` (not `background-color`): the fallback is a gradient
        // (an image), which `background-color` would reject → invisible bar.
        background: `var(${activeVars.bg}, ${activeFallback})`,
      }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          willChange: 'transform',
          transform: `translateY(${view.offset}px)`,
          transition: view.animate
            ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
        }}>
        {normalizedZones.map((zone, zi) => (
          <div
            key={`${zone.zoneId}.${zone.contentId}`}
            style={{ order: slotOrder[zi], width: '100%', flexShrink: 0 }}>
            <BannerZoneSlot
              zone={zone}
              index={zi}
              onChange={handleZoneChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
