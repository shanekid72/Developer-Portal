import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { gsap } from 'gsap';
import clsx from 'clsx';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  rootSelector?: string;
}

const TableOfContents = ({ className, rootSelector = 'main' }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const { scrollToSection } = useSmoothScroll();
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootElement = rootSelector ? document.querySelector(rootSelector) : document;
    if (!rootElement) return;

    // Find all headings in the content
    const headings = rootElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent || '';

      items.push({ id, title, level });
    });

    setTocItems(items);

    // Set up intersection observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [rootSelector]);

  useEffect(() => {
    const toc = tocRef.current;
    if (!toc || tocItems.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate TOC items
    const items = toc.querySelectorAll('.toc-item');
    gsap.fromTo(items,
      { 
        opacity: 0, 
        x: -20 
      },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }
    );
  }, [tocItems]);

  const handleItemClick = (id: string) => {
    scrollToSection(id, -100);
  };

  if (tocItems.length === 0) return null;

  return (
    <motion.div
      ref={tocRef}
      className={clsx(
        'sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto',
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Table of Contents
          </h3>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={clsx(
                    'toc-item block w-full text-left text-sm transition-colors duration-200 rounded px-2 py-1',
                    {
                      'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950': 
                        activeId === item.id,
                      'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700': 
                        activeId !== item.id,
                      'pl-2': item.level === 1,
                      'pl-4': item.level === 2,
                      'pl-6': item.level === 3,
                      'pl-8': item.level >= 4,
                    }
                  )}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default TableOfContents; 