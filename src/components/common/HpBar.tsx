import React from 'react';

interface HpBarProps {
  current: number;
  max: number;
  showNumbers?: boolean;
  height?: number;
  color?: string;
  label?: string;
}

export const HpBar: React.FC<HpBarProps> = ({ current, max, showNumbers = true, height = 12, color, label }) => {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = color || (pct > 60 ? 'var(--accent-green)' : pct > 30 ? 'var(--accent-yellow)' : 'var(--hp-bar)');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      width: '100%',
    }}>
      <div style={{
        flex: 1,
        height,
        background: 'var(--hp-bar-bg)',
        borderRadius: height / 2,
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: barColor,
          borderRadius: height / 2,
          transition: 'width 0.5s ease, background 0.3s ease',
        }} />
      </div>
      {showNumbers && (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {label ? `${label} ` : ''}{current}/{max}
        </span>
      )}
    </div>
  );
};
