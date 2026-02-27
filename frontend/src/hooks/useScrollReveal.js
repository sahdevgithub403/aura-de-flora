
import { useState, useEffect, useRef } from 'react';

const useScrollReveal = ({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  delay = 0
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const frozen = useRef(false);
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (triggerOnce) {
            frozen.current = true;
            observer.unobserve(element);
          }

          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              if (isMounted.current) setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
          }
        } else if (!triggerOnce) {
          // Clear any pending visible timeout if we leave before it fires
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return [ref, isVisible];
};

export default useScrollReveal;
