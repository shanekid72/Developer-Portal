import { useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugin
gsap.registerPlugin(ScrollToPlugin);

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((target: string | Element, options: {
    duration?: number;
    offset?: number;
    container?: string | Element;
  } = {}) => {
    const { duration = 1, offset = 0, container } = options;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }
      return;
    }

    const scrollConfig: any = {
      duration,
      ease: 'power2.out'
    };

    if (container) {
      // Scroll within container
      scrollConfig.scrollTo = {
        y: target,
        offsetY: offset
      };
      gsap.to(container, scrollConfig);
    } else {
      // Scroll window
      scrollConfig.scrollTo = {
        y: target,
        offsetY: offset
      };
      gsap.to(window, scrollConfig);
    }
  }, []);

  const scrollToSection = useCallback((sectionId: string, offset: number = -80) => {
    scrollToElement(`#${sectionId}`, { offset });
  }, [scrollToElement]);

  return { scrollToElement, scrollToSection };
}; 