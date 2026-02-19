import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMobile } from '../../hooks/useMobile';

export const VictoryScreen: React.FC = () => {
  const { compact } = useMobile();
  const { run, restart } = useGameStore();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: compact ? 14 : 28,
      padding: compact ? 20 : 48,
      maxWidth: 620,
      margin: '0 auto',
    }} className="animate-fade-in">

      <div style={{ fontSize: compact ? 40 : 72 }}>🌟</div>

      <h1 style={{
        fontSize: compact ? 24 : 36,
        background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        lineHeight: 1.2,
        margin: 0,
      }}>
        You got the job.
      </h1>

      <p style={{
        color: 'var(--text-primary)',
        fontSize: compact ? 14 : 16,
        textAlign: 'center',
        lineHeight: 1.8,
        maxWidth: 500,
        margin: 0,
      }}>
        The phone screens. The take-homes. The five-round panels where you had to explain
        a binary tree to someone who hasn't written code since 2009. You survived all of it.
      </p>

      <p style={{
        color: 'var(--text-primary)',
        fontSize: compact ? 14 : 16,
        textAlign: 'center',
        lineHeight: 1.8,
        maxWidth: 500,
        margin: 0,
      }}>
        Whether you're in the thick of a real job search right now, just wrapped one up,
        or you're happily employed and needed a reminder that you're not alone in the
        absurdity of it all — I hope this made you smile, or laugh, or feel just a little
        less crazy for thinking the process is broken.
      </p>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: compact ? 13 : 15,
        textAlign: 'center',
        lineHeight: 1.8,
        maxWidth: 500,
        fontStyle: 'italic',
        margin: 0,
      }}>
        The right opportunity is out there. Your skills are real. The rejections say nothing
        about your worth — they say everything about fit, timing, and a little bit of luck.
        Keep going. You're closer than it feels.
      </p>

      {run && (
        <div style={{
          background: 'var(--bg-card)',
          padding: compact ? 12 : 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid #a8edea44',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
            Run completed as
          </p>
          <p style={{ fontSize: 15, marginBottom: 4 }}>
            {run.character.icon} {run.character.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {run.hp}/{run.maxHp} HP remaining · {run.deck.length} cards · 💰 {run.gold} gold
          </p>
          {run.items.length > 0 && (
            <p style={{ fontSize: 14, marginTop: 6 }}>
              {run.items.map(i => i.icon).join(' ')}
            </p>
          )}
        </div>
      )}

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: compact ? 12 : 13,
        textAlign: 'center',
        maxWidth: 460,
        lineHeight: 1.7,
        margin: 0,
      }}>
        Thank you for playing. This game was made with love — not just for games,
        but for engineering as a discipline and an art form. The craft is real. The
        community is real. Don't give up on it, and don't give up on yourself.
        We will evolve. We always do.
      </p>

      <button
        className="primary"
        onClick={restart}
        style={{ padding: compact ? '12px 28px' : '14px 36px', fontSize: 15 }}
      >
        Play Again
      </button>
    </div>
  );
};
