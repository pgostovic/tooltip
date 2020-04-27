import React, {
  ComponentType,
  createRef,
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled, { keyframes } from 'styled-components';

const Root = styled.span<{ clickable: boolean }>`
  position: relative;
  display: inline-block;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'auto')};
`;

const ANIM_TIME = 150;
const MIN_SCALE = 0.8;
const BG_COLORS = ['#eee', '#fff', '#eee'];
const BOUNDS_PADDING = 15;
const DEFAULT_MAX_WIDTH = 300;

type TipLocation = 'top' | 'right' | 'bottom' | 'left';

const tipIn = keyframes`
  from {
    opacity: 0;
    transform: scale(${MIN_SCALE});
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const tipOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(${MIN_SCALE});
  }
`;

const Content = styled.span`
  display: block;
  max-height: 200px;
  overflow: auto;
`;

const transformOrigin = (tipLocation: TipLocation) =>
  tipLocation === 'top'
    ? 'bottom'
    : tipLocation === 'bottom'
    ? 'top'
    : tipLocation === 'left'
    ? 'right'
    : tipLocation === 'right'
    ? 'left'
    : 'center';

interface TipProps {
  offset: number;
  width: number;
  tipLocation: TipLocation;
  interactable: boolean;
}

const Tip = styled.span<TipProps>`
  pointer-events: ${({ interactable }) => (interactable ? 'initial' : 'none')};
  cursor: auto;
  position: fixed;
  z-index: 10;
  width: ${({ width }) => (width ? `${width}px` : 'auto')};
  white-space: ${({ width }) => (width ? 'normal' : 'nowrap')};
  padding: 10px 15px;
  border-radius: 5px;
  opacity: 0;
  animation-duration: ${ANIM_TIME}ms;
  animation-delay: 50ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
  animation-name: ${tipIn};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  background-image: linear-gradient(110deg, ${BG_COLORS.join(', ')});
  transform-origin: ${({ tipLocation }) => transformOrigin(tipLocation)};

  &.out {
    animation-delay: 0;
    opacity: 1;
    animation-name: ${tipOut};
  }
`;

const BaseArrow = styled.span<{ tipLocation: TipLocation; offset: number }>`
  position: absolute;
  width: 30px;
  height: 30px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
  }
`;

const TopArrow = styled(BaseArrow)`
  height: 20px;
  top: 100%;
  left: calc(50% - 15px);
  transform: translateX(${({ offset }) => -offset || 0}px);

  &::after {
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
    left: 5px;
    top: -10px;
    background-color: ${BG_COLORS[1]};
  }
`;

const BottomArrow = styled(BaseArrow)`
  height: 20px;
  top: -20px;
  left: calc(50% - 15px);
  transform: translateX(${({ offset }) => -offset || 0}px);

  &::after {
    box-shadow: -3px -3px 3px rgba(0, 0, 0, 0.1);
    left: 5px;
    top: 10px;
    background-color: ${BG_COLORS[1]};
  }
`;

const LeftArrow = styled(BaseArrow)`
  width: 20px;
  top: calc(50% - 15px);
  left: 100%;
  transform: translateY(${({ offset }) => -offset || 0}px);

  &::after {
    box-shadow: 3px -3px 3px rgba(0, 0, 0, 0.1);
    left: -10px;
    top: 5px;
    background-color: ${BG_COLORS[2]};
  }
`;

const RightArrow = styled(BaseArrow)`
  width: 20px;
  top: calc(50% - 15px);
  left: -20px;
  transform: translateY(${({ offset }) => -offset || 0}px);

  &::after {
    box-shadow: -3px 3px 3px rgba(0, 0, 0, 0.1);
    left: 10px;
    top: 5px;
    background-color: ${BG_COLORS[0]};
  }
`;

enum TipState {
  Hidden,
  Visible,
  Hiding,
}

interface Props {
  className?: string;
  style?: CSSProperties;
  tip: ReactNode | ComponentType<{ onHide(): void }>;
  location?: TipLocation;
  maxWidth?: number;
  interactable?: boolean;
  clickToShow?: boolean;
}

const Tooltip: FC<Props> = ({
  children,
  className,
  style,
  tip,
  location = 'top',
  maxWidth = DEFAULT_MAX_WIDTH,
  interactable = false,
  clickToShow = false,
}) => {
  const ref = createRef<HTMLSpanElement>();
  const tipRef = createRef<HTMLSpanElement>();
  const scrolledRef = useRef(false);

  const [multiline, setMultiline] = useState(false);
  const [offset, setOffset] = useState(0);
  const [tipState, setTipState] = useState(TipState.Hidden);
  const [tipLocation, setTipLocation] = useState<TipLocation>(location);

  const TipComponent = typeof tip === 'function' ? tip : undefined;

  useLayoutEffect(() => {
    if (ref.current && tipRef.current && tipState === TipState.Visible) {
      /**
       * The Tip element has fixed positioning which makes it difficult to programmatically
       * move relative to other elements, especially if inside scrollable elements. So, first
       * set the tip to (0, 0) and then see what the resulting getBoundingClientRect() returns.
       * The left and top are the offsets.
       */
      tipRef.current.style.left = '0';
      tipRef.current.style.top = '0';

      let tipRect = tipRef.current.getBoundingClientRect();

      // If the tip is too wide, then convert to multiline.
      if (!multiline && tipRect.right - tipRect.left > maxWidth) {
        setMultiline(true);
        return;
      }

      const rootRect = ref.current.getBoundingClientRect();

      const [tipW, tipH] = [tipRect.right - tipRect.left, tipRect.bottom - tipRect.top];
      const [rootW, rootH] = [rootRect.right - rootRect.left, rootRect.bottom - rootRect.top];
      let [tipL, tipT] = [rootRect.left - tipRect.left, rootRect.top - tipRect.top];

      // Move the tip to the right place...
      if (tipLocation === 'top') {
        tipL += rootW / 2 - tipW / 2;
        tipT += -(tipH + 20);
      } else if (tipLocation === 'bottom') {
        tipL += rootW / 2 - tipW / 2;
        tipT += rootH + 20;
      } else if (tipLocation === 'left') {
        tipL += -(tipW + 20);
        tipT += rootH / 2 - tipH / 2;
      } else if (tipLocation === 'right') {
        tipL += rootW + 20;
        tipT += rootH / 2 - tipH / 2;
      }

      tipRef.current.style.left = `${tipL}px`;
      tipRef.current.style.top = `${tipT}px`;

      tipRect = tipRef.current.getBoundingClientRect();

      const bounds = {
        left: BOUNDS_PADDING,
        top: BOUNDS_PADDING,
        bottom: (window.innerHeight || document.documentElement.clientHeight) - BOUNDS_PADDING,
        right: (window.innerWidth || document.documentElement.clientWidth) - BOUNDS_PADDING,
      };

      // Flip the tooltip location around if it would be hidden.
      if (tipLocation === 'left' && tipRect.left < bounds.left) {
        setTipLocation('right');
      } else if (tipLocation === 'right' && tipRect.right > bounds.right) {
        setTipLocation('left');
      } else if (tipLocation === 'top' && tipRect.top < bounds.top) {
        setTipLocation('bottom');
      } else if (tipLocation === 'bottom' && tipRect.bottom > bounds.bottom) {
        setTipLocation('top');
      }

      const [xOffset, yOffset] = [
        Math.max(bounds.left - tipRect.left, 0) + Math.min(bounds.right - tipRect.right, 0),
        Math.max(bounds.top - tipRect.top, 0) + Math.min(bounds.bottom - tipRect.bottom, 0),
      ];

      // Slide the tooltip around to make it visible, but keep the arrow where it is.
      if ((tipLocation === 'left' || tipLocation === 'right') && yOffset) {
        tipRef.current.style.top = `${tipT + yOffset}px`;
        setOffset(yOffset);
      } else if ((tipLocation === 'bottom' || tipLocation === 'top') && xOffset) {
        tipRef.current.style.left = `${tipL + xOffset}px`;
        setOffset(xOffset);
      }
    }
  }, [tipState, tipLocation, multiline]);

  const Arrow = getArrowComponent(tipLocation);

  // TODO: if children is an element then don't wrap it, just attach the event handlers to it.

  const escapeHandler = useCallback(({ keyCode }: KeyboardEvent) => {
    if (keyCode === 27) {
      hideTip();
    }
  }, []);

  const showTip = useCallback(() => {
    pushTip(ref.current);
    scrolledRef.current = false;
    setMultiline(false);
    setOffset(0);
    setTipLocation(location);
    setTipState(TipState.Visible);
    window.addEventListener('keydown', escapeHandler);
  }, [location]);

  const hideTip = useCallback(() => {
    const rootElmnt = ref.current;
    setTimeout(() => {
      setTipState(t => (t === TipState.Hiding ? TipState.Hidden : t));
      popTip(rootElmnt);
    }, ANIM_TIME);
    setTipState(t => (t === TipState.Visible ? TipState.Hiding : t));
    window.removeEventListener('keydown', escapeHandler);
  }, []);

  return (
    <Root
      ref={ref}
      className={className}
      style={style}
      clickable={clickToShow}
      onClick={
        clickToShow
          ? ({ target, currentTarget }) => {
              if (target === currentTarget) {
                showTip();
              }
            }
          : undefined
      }
      onMouseEnter={
        clickToShow
          ? undefined
          : ({ target }) => {
              if (target !== tipRef.current) {
                showTip();
              }
            }
      }
      onMouseLeave={() => {
        hideTip();
      }}
      onWheel={({ target, deltaY }) => {
        if (target === ref.current && deltaY !== 0 && !scrolledRef.current) {
          scrolledRef.current = true;
          hideTip();
        }
      }}
    >
      {children}
      {tipState !== TipState.Hidden && Tip && Arrow && (
        <Tip
          ref={tipRef}
          className={tipState === TipState.Hiding ? 'out' : undefined}
          offset={offset}
          width={multiline ? maxWidth : 0}
          interactable={interactable}
          tipLocation={tipLocation}
        >
          {TipComponent === undefined ? (
            <Content>{tip}</Content>
          ) : (
            <Content>
              <TipComponent onHide={hideTip} />
            </Content>
          )}
          <Arrow tipLocation={tipLocation} offset={offset} />
        </Tip>
      )}
    </Root>
  );
};

const getArrowComponent = (tipLocation: TipLocation) =>
  tipLocation === 'top'
    ? TopArrow
    : tipLocation === 'bottom'
    ? BottomArrow
    : tipLocation === 'left'
    ? LeftArrow
    : tipLocation === 'right'
    ? RightArrow
    : undefined;

/**
 * Tooltips rely on fixed positioning so they can be positioned relative to the viewport.
 * However, the CSS property `will-change` (https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
 * affects the behaviour of descendents with fixed positioning.
 *
 * The pushTip() and popTip() functions below are meant to work around this side-effect by temporarily
 * removing `will-change` from ancestors while tooltips are visible.
 */
const trackedAncestors = new Map<HTMLElement, { willChange: string; refCount: number }>();

const pushTip = (tipElmnt: HTMLElement | null) => {
  if (tipElmnt) {
    let elmnt = tipElmnt.parentElement;
    while (elmnt) {
      const ancestor = trackedAncestors.get(elmnt);
      if (ancestor) {
        ancestor.refCount += 1;
      } else if (elmnt.style.willChange) {
        trackedAncestors.set(elmnt, { willChange: elmnt.style.willChange, refCount: 1 });
        elmnt.style.willChange = '';
      }
      elmnt = elmnt.parentElement;
    }
  }
};

const popTip = (tipElmnt: HTMLElement | null) => {
  if (tipElmnt) {
    let elmnt = tipElmnt.parentElement;
    while (elmnt) {
      const ancestor = trackedAncestors.get(elmnt);
      if (ancestor) {
        ancestor.refCount -= 1;
        if (ancestor.refCount === 0) {
          elmnt.style.willChange = ancestor.willChange;
          trackedAncestors.delete(elmnt);
        }
      }
      elmnt = elmnt.parentElement;
    }
  }
};

export default Tooltip;
