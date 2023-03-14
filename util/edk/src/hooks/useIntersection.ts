import type React from 'react';
import Scope from '../';
const { useState, useEffect } = Scope.react;

export default (ref: React.MutableRefObject<HTMLElement | null>) => {
  const [contentRect, setContentRect] = useState<IntersectionObserverEntry>();

  const intersectionObserver = new IntersectionObserver((entries) => {
    setContentRect(entries?.[0]);
  });

  useEffect(() => {
    intersectionObserver.observe(ref?.current as HTMLElement);
    return () => {
      intersectionObserver.disconnect();
    };
  }, [ref]);

  return contentRect;
};
