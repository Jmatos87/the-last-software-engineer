import React, { useState, useRef, useCallback } from 'react';

interface TooltipProps {
  text?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  position?: 'above' | 'below';
}

export const Tooltip: React.FC<TooltipProps> = ({ text, content, children, position = 'above' }) => {
  const [pos, setPos] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const useBelow = position === 'below' || rect.top < 80;
      setPos({
        x: rect.left + rect.width / 2,
        y: useBelow ? rect.bottom : rect.top,
        below: useBelow,
      });
    }
  }, [position]);

  const hide = useCallback(() => setPos(null), []);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {pos && (
        <div style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          transform: pos.below ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
          marginTop: pos.below ? 8 : -8,
          padding: '6px 10px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          color: 'var(--text-primary)',
          whiteSpace: 'normal',
          maxWidth: 280,
          width: 'max-content',
          textAlign: 'center',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'fadeIn 0.15s ease',
        }}>
          {content || text}
        </div>
      )}
    </div>
  );
};
