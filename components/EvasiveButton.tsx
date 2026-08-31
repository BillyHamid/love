"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export interface EvasiveButtonProps {
  label: string;
  /** À `false`, le bouton se comporte comme un bouton ordinaire. */
  evasive?: boolean;
  /** Nombre d'esquives avant que le bouton renonce et disparaisse. */
  maxAttempts?: number;
  /** Appelé après chaque esquive, avec le total de tentatives. */
  onEscape?: (attempts: number) => void;
  /** Activation réelle : clic quand `evasive` est faux, ou clavier. */
  onClick?: () => void;
  /** Zone à l'intérieur de laquelle le bouton a le droit de fuir. */
  playAreaRef: RefObject<HTMLElement | null>;
  /** Élément à ne jamais recouvrir — le bouton OUI. */
  avoidRef?: RefObject<HTMLElement | null>;
  /** Appelé une fois le bouton effacé, après `maxAttempts` esquives. */
  onSurrender?: () => void;
  className?: string;
}

/** Marge conservée entre le bouton et les bords de la zone de jeu. */
const SAFE_PADDING = 20;
/** Deux événements pointeur pour un même geste ne comptent que pour un. */
const DODGE_COOLDOWN_MS = 180;
/** À la souris, il fuit avant même d'être survolé. */
const PROXIMITY_PX = 58;
/** Marge laissée autour du bouton OUI. */
const AVOID_PADDING = 12;
const CANDIDATE_COUNT = 28;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Point {
  x: number;
  y: number;
}

/** Distance d'un point au bord le plus proche d'un rectangle (0 s'il est dedans). */
function distanceToRect(rect: Rect, point: Point): number {
  const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.w));
  const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.h));
  return Math.hypot(dx, dy);
}

function intersects(a: Rect, b: Rect, padding: number): boolean {
  return (
    a.x < b.x + b.w + padding &&
    a.x + a.w + padding > b.x &&
    a.y < b.y + b.h + padding &&
    a.y + a.h + padding > b.y
  );
}

/**
 * Difficulté croissante… jusqu'à l'essoufflement.
 * Le bouton monte en puissance sur les trois premiers quarts des tentatives,
 * puis ralentit et se laisse approcher : le but est de faire rire, pas d'user.
 */
function difficulty(attempts: number, maxAttempts: number) {
  const ratio = maxAttempts > 0 ? Math.min(attempts / maxAttempts, 1) : 1;
  const intensity =
    ratio <= 0.75 ? ratio / 0.75 : 1 - ((ratio - 0.75) / 0.25) * 0.55;

  return {
    minMove: 55 + intensity * 85,
    maxMove: 150 + intensity * 320,
    minPointerDistance: 70 + intensity * 80,
    stiffness: 280 + intensity * 320,
    damping: 26 - intensity * 8,
    intensity,
  };
}

export default function EvasiveButton({
  label,
  evasive = true,
  maxAttempts = 7,
  onEscape,
  onClick,
  playAreaRef,
  avoidRef,
  onSurrender,
  className = "",
}: EvasiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const attemptsRef = useRef(0);
  const lastDodgeRef = useRef(0);
  const exhaustedRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [spring, setSpring] = useState({ stiffness: 300, damping: 24 });
  const [isPlaced, setIsPlaced] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  /** Bornes de déplacement, toujours valides même dans une zone minuscule. */
  const getBounds = useCallback(() => {
    const area = playAreaRef.current;
    const button = buttonRef.current;
    if (!area || !button) return null;

    const availableX = area.clientWidth - button.offsetWidth;
    const availableY = area.clientHeight - button.offsetHeight;
    const padX = Math.min(SAFE_PADDING, Math.max(0, availableX / 2));
    const padY = Math.min(SAFE_PADDING, Math.max(0, availableY / 2));

    return {
      minX: padX,
      maxX: Math.max(padX, availableX - padX),
      minY: padY,
      maxY: Math.max(padY, availableY - padY),
      w: button.offsetWidth,
      h: button.offsetHeight,
    };
  }, [playAreaRef]);

  /** Le rectangle du bouton OUI, exprimé dans le repère de la zone de jeu. */
  const getAvoidRect = useCallback((): Rect | null => {
    const area = playAreaRef.current;
    const avoid = avoidRef?.current;
    if (!area || !avoid) return null;

    const areaBox = area.getBoundingClientRect();
    const avoidBox = avoid.getBoundingClientRect();
    return {
      x: avoidBox.left - areaBox.left,
      y: avoidBox.top - areaBox.top,
      w: avoidBox.width,
      h: avoidBox.height,
    };
  }, [playAreaRef, avoidRef]);

  /**
   * Tire plusieurs positions au hasard, écarte celles qui sont hors zone,
   * trop proches du doigt ou du curseur, ou qui recouvrent le OUI — puis en
   * choisit une. Les contraintes sont relâchées une à une si aucune ne passe,
   * pour qu'il reste toujours une destination valide.
   */
  const pickPosition = useCallback(
    (current: Point, pointer: Point | null, attempts: number): Point => {
      const bounds = getBounds();
      if (!bounds) return current;

      const { minMove, maxMove, minPointerDistance } = difficulty(attempts, maxAttempts);
      const avoidRect = getAvoidRect();

      for (let relax = 0; relax < 4; relax += 1) {
        const candidates: Point[] = [];

        for (let i = 0; i < CANDIDATE_COUNT; i += 1) {
          const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
          const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
          const candidate: Rect = { x, y, w: bounds.w, h: bounds.h };

          // Ne jamais recouvrir le OUI : il doit rester cliquable.
          if (avoidRect && intersects(candidate, avoidRect, AVOID_PADDING)) continue;

          if (relax < 3 && pointer) {
            if (distanceToRect(candidate, pointer) < minPointerDistance) continue;
          }

          if (relax < 2) {
            const travelled = Math.hypot(x - current.x, y - current.y);
            // Un saut trop court ne se voit pas, un saut à l'autre bout frustre.
            if (travelled < minMove) continue;
            if (relax < 1 && travelled > maxMove) continue;
          }

          candidates.push({ x, y });
        }

        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        if (chosen) return chosen;
      }

      return current;
    },
    [getBounds, getAvoidRect, maxAttempts],
  );

  /** Place le bouton en haut, centré, dès que la zone est mesurable. */
  useEffect(() => {
    const area = playAreaRef.current;
    if (!area) return;

    const place = () => {
      const bounds = getBounds();
      if (!bounds || bounds.maxX <= 0) return;
      setPosition((current) =>
        isPlaced
          ? // Après un redimensionnement : on ramène le bouton dans les bornes.
            {
              x: Math.min(Math.max(current.x, bounds.minX), bounds.maxX),
              y: Math.min(Math.max(current.y, bounds.minY), bounds.maxY),
            }
          : { x: (bounds.minX + bounds.maxX) / 2, y: bounds.minY },
      );
      setIsPlaced(true);
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(area);
    return () => observer.disconnect();
  }, [playAreaRef, getBounds, isPlaced]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const dodge = useCallback(
    (pointer: Point | null) => {
      if (!evasive || exhaustedRef.current) return;

      const now = Date.now();
      // `pointerenter` et `pointerdown` arrivent ensemble sur un même appui :
      // le geste ne doit compter que pour une tentative.
      if (now - lastDodgeRef.current < DODGE_COOLDOWN_MS) return;
      lastDodgeRef.current = now;

      const attempts = attemptsRef.current + 1;
      attemptsRef.current = attempts;

      const { stiffness, damping, intensity } = difficulty(attempts, maxAttempts);
      setSpring({ stiffness, damping });
      setPosition((current) => pickPosition(current, pointer, attempts));
      setRotation(
        prefersReducedMotion || Math.random() > 0.45
          ? 0
          : (Math.random() - 0.5) * 16 * (0.4 + intensity),
      );

      onEscape?.(attempts);

      if (attempts >= maxAttempts) {
        exhaustedRef.current = true;
        // Il souffle un instant à sa dernière position, puis s'évapore.
        window.setTimeout(() => setIsGone(true), 620);
      }
    },
    [evasive, maxAttempts, pickPosition, prefersReducedMotion, onEscape],
  );

  /** Convertit des coordonnées écran vers le repère de la zone de jeu. */
  const toAreaPoint = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const area = playAreaRef.current;
      if (!area) return null;
      const box = area.getBoundingClientRect();
      return { x: clientX - box.left, y: clientY - box.top };
    },
    [playAreaRef],
  );

  /**
   * À la souris, le bouton fuit dès que le curseur approche — sans attendre
   * le survol. Écouté sur la zone de jeu, pas sur la fenêtre entière.
   */
  useEffect(() => {
    const area = playAreaRef.current;
    if (!area || !evasive) return;

    const handleMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const bounds = getBounds();
        const point = toAreaPoint(event.clientX, event.clientY);
        if (!bounds || !point) return;

        const rect: Rect = { x: position.x, y: position.y, w: bounds.w, h: bounds.h };
        if (distanceToRect(rect, point) < PROXIMITY_PX) dodge(point);
      });
    };

    area.addEventListener("pointermove", handleMove);
    return () => area.removeEventListener("pointermove", handleMove);
  }, [playAreaRef, evasive, position, getBounds, toAreaPoint, dodge]);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!evasive) return;
    dodge(toAreaPoint(event.clientX, event.clientY));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!evasive) return;
    // Au doigt, il faut bouger AVANT que le clic ne parte.
    event.preventDefault();
    dodge(toAreaPoint(event.clientX, event.clientY));
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!evasive) {
      onClick?.();
      return;
    }
    // Au pointeur, le bouton ne s'active jamais. On ne peut pas distinguer
    // ici un clic tactile d'une activation clavier — Chrome met `detail` à 0
    // dans les deux cas — donc le clavier est traité dans `onKeyDown`.
    event.preventDefault();
    dodge(toAreaPoint(event.clientX, event.clientY));
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!evasive) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    // Le bouton n'est évasif qu'au pointeur : au clavier, il répond.
    // `preventDefault` empêche le clic synthétisé, qui serait bloqué.
    event.preventDefault();
    onClick?.();
  };

  return (
    <AnimatePresence onExitComplete={onSurrender}>
      {isGone ? null : (
        <motion.button
          key="evasive"
          ref={buttonRef}
          type="button"
          onPointerEnter={handlePointerEnter}
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          initial={false}
          animate={{
            x: position.x,
            y: position.y,
            rotate: rotation,
            opacity: isPlaced ? 1 : 0,
            scale: 1,
          }}
          exit={{ opacity: 0, scale: 0.4, rotate: 24, transition: { duration: 0.4 } }}
          transition={
            prefersReducedMotion
              ? { duration: 0.2, ease: "easeOut" }
              : { type: "spring", stiffness: spring.stiffness, damping: spring.damping }
          }
          className={`absolute top-0 left-0 touch-manipulation ${className}`}
        >
          {label}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
