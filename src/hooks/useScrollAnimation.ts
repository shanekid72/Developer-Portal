import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  animation?: gsap.core.Tween;
  onEnter?: () => void;
  onLeave?: () => void;
  onUpdate?: (progress: number) => void;
}

export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(options: UseScrollAnimationOptions = {}) => {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const {
      trigger = element,
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      animation,
      onEnter,
      onLeave,
      onUpdate
    } = options;

    // Default animation if none provided
    const defaultAnimation = gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: 'power2.out'
      }
    );

    animationRef.current = ScrollTrigger.create({
      trigger: typeof trigger === 'string' ? trigger : element,
      start,
      end,
      scrub,
      animation: animation || defaultAnimation,
      onEnter: () => {
        if (!animation) {
          defaultAnimation.play();
        }
        onEnter?.();
      },
      onLeave: onLeave,
      onUpdate: (self) => onUpdate?.(self.progress)
    });

    return () => {
      animationRef.current?.kill();
      if (!animation) {
        defaultAnimation.kill();
      }
    };
  }, [options]);

  return elementRef;
};

export const useStaggeredScrollAnimation = <T extends HTMLElement = HTMLElement>(itemsSelector: string, options: UseScrollAnimationOptions = {}) => {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const items = container.querySelectorAll(itemsSelector);
    if (items.length === 0) return;

    const { start = 'top 80%', onEnter } = options;

    // Staggered animation
    const tl = gsap.timeline();
    tl.fromTo(items,
      { 
        opacity: 0, 
        y: 30 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );

    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      onEnter: () => {
        tl.play();
        onEnter?.();
      }
    });

    return () => {
      trigger.kill();
      tl.kill();
    };
  }, [itemsSelector, options]);

  return containerRef;
}; 