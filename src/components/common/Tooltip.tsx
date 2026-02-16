import React, { useState, useRef, useCallback } from 'react';

interface TooltipProps {
  text?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, content, children }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top });
    }
  }, []);

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
          transform: 'translate(-50%, -100%)',
          marginTop: -8,
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
