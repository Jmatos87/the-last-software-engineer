import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { useMobile } from '../../hooks/useMobile';

export const VictoryScreen: React.FC = () => {
  const { compact } = useMobile();
  const { run, restart } = useGameStore();

  useEffect(() => {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.4 },
      colors: ['#fbbf24', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa', '#fed6e3'],
    });
    const t = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#fbbf24', '#4ade80', '#60a5fa'],
      });
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#f472b6', '#a78bfa', '#fed6e3'],
      });
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: compact ? 'flex-start' : 'center',
      gap: compact ? 10 : 28,
      padding: compact ? '12px 16px' : 48,
      maxWidth: 620,
      margin: '0 auto',
    }} className="animate-fade-in">

      <div style={{ fontSize: compact ? 32 : 72 }}>🌟</div>

      <h1 style={{
        fontSize: compact ? 20 : 36,
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
        fontSize: compact ? 13 : 16,
        textAlign: 'center',
        lineHeight: 1.8,
        maxWidth: 500,
        margin: 0,
      }}>
        The phone screens. The take-homes. The five-round panels where you had to explain
        a binary tree to someone who hasn't written code since 2009. You survived all of it.
      </p>

      {!compact && (
        <p style={{
          color: 'var(--text-primary)',
          fontSize: 16,
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
      )}

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: compact ? 12 : 15,
        textAlign: 'center',
        lineHeight: 1.8,
        maxWidth: 500,
        fontStyle: 'italic',
        margin: 0,
      }}>
        The right opportunity is out there. Your skills are real. Keep going.
        {!compact && " You're closer than it feels."}
      </p>

      {run && (
        <div style={{
          background: 'var(--bg-card)',
          padding: compact ? 10 : 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid #a8edea44',
          textAlign: 'center',
          width: '100%',
          maxWidth: 380,
        }}>
          <p style={{ fontSize: 12, marginBottom: 4, color: 'var(--text-secondary)' }}>
            Run completed as
          </p>
          <p style={{ fontSize: compact ? 13 : 15, marginBottom: 4 }}>
            {run.character.icon} {run.character.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {run.hp}/{run.maxHp} HP · {run.deck.length} cards · 💰 {run.gold}
          </p>
          {run.items.length > 0 && (
            <p style={{ fontSize: 14, marginTop: 6 }}>
              {run.items.map(i => i.icon).join(' ')}
            </p>
          )}
        </div>
      )}

      {!compact && (
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 13,
          textAlign: 'center',
          maxWidth: 460,
          lineHeight: 1.7,
          margin: 0,
        }}>
          Thank you for playing. This game was made with love — not just for games,
          but for engineering as a discipline and an art form. The craft is real.
          Don't give up on it, and don't give up on yourself.
        </p>
      )}

      <button
        className="primary"
        onClick={restart}
        style={{ padding: compact ? '10px 24px' : '14px 36px', fontSize: 15 }}
      >
        Play Again
      </button>
    </div>
  );
};
