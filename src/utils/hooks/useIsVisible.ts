import { useEffect, useMemo, useState } from 'react';

export const useIsVisible = (ref: React.RefObject<HTMLElement>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting)), []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [observer, ref]);

  return isIntersecting;
};
