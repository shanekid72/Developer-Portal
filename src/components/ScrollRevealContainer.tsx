import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import clsx from 'clsx';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  stagger?: boolean;
  from?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotationX?: number;
    rotationY?: number;
  };
  to?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
    rotationX?: number;
    rotationY?: number;
  };
}

const ScrollRevealContainer = ({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  stagger = false,
  from = { opacity: 0, y: 50 },
  to = { opacity: 1, y: 0 }
}: ScrollRevealProps) => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = revealRef.current;
    if (!container) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If user prefers reduced motion, show content immediately
    if (prefersReducedMotion) {
      gsap.set(container, { opacity: 1 });
      
      if (stagger && container.children.length) {
        gsap.set(container.children, { opacity: 1 });
      }
      return;
    }
    
    // Create animation context
    const ctx = gsap.context(() => {
      // For staggered animations
      if (stagger && container.children.length) {
        gsap.set(container.children, { ...from });
        
        ScrollTrigger.create({
          trigger: container,
          start: `top bottom-=${threshold * 100}%`,
          onEnter: () => {
            gsap.to(container.children, {
              ...to,
              stagger: 0.1,
              duration: 0.7,
              ease: 'power2.out',
              delay
            });
          },
          once: true
        });
      } 
      // For single element animations
      else {
        gsap.set(container, { ...from });
        
        ScrollTrigger.create({
          trigger: container,
          start: `top bottom-=${threshold * 100}%`,
          onEnter: () => {
            gsap.to(container, {
              ...to,
              duration: 0.7,
              ease: 'power2.out',
              delay
            });
          },
          once: true
        });
      }
    }, revealRef);
    
    return () => ctx.revert();
  }, [threshold, delay, stagger, from, to]);
  
  return (
    <div 
      ref={revealRef} 
      className={clsx(
        stagger ? 'reveal-stagger' : 'reveal', 
        className
      )}
      style={{ willChange: 'opacity, transform' }}
      aria-hidden="false"
    >
      {children}
    </div>
  );
};

export default ScrollRevealContainer; 