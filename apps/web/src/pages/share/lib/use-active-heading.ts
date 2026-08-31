import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export const useActiveHeading = (
  contentRef: RefObject<HTMLDivElement | null>,
  headingIds: readonly string[],
): string | null => {
  const [activeId, setActiveId] = useState<string | null>(
    headingIds[0] ?? null,
  );

  useEffect(() => {
    const container = contentRef.current;

    if (container === null || headingIds.length === 0) {
      return;
    }

    const elements = headingIds
      .map((id) => container.querySelector(`#${CSS.escape(id)}`))
      .filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (visible.length > 0) {
          const first = visible[0];

          if (first !== undefined) {
            setActiveId(first.target.id);
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [contentRef, headingIds]);

  return activeId;
};
