import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { characters } from '../../data/characters';
import { getCardDef } from '../../data/cards';
import { getStarterRelic } from '../../data/items';
import { CardPreview } from '../common/CardPreview';
import { useMobile } from '../../hooks/useMobile';
import type { CardDef } from '../../types';

export const CharacterSelectScreen: React.FC = () => {
  const { compact } = useMobile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ card: CardDef; x: number; y: number } | null>(null);
  const { selectCharacter, startRun, run } = useGameStore();

  const selectedChar = characters.find(c => c.id === selectedId);

  const handleSelect = (id: string) => {
    const char = characters.find(c => c.id === id);
    if (!char?.available) return;
    setSelectedId(id);
    selectCharacter(id);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: compact ? 'flex-start' : 'center',
      gap: compact ? 12 : 32,
      padding: compact ? 12 : 32,
      overflow: compact ? 'auto' : undefined,
    }} className="animate-fade-in">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: compact ? 18 : 28, color: 'var(--accent-cyan)', marginBottom: compact ? 4 : 8 }}>
          {'>'} The Last Software Engineer _
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: compact ? 11 : 14 }}>
          Choose your class to begin
        </p>
      </div>

      <div style={{ display: 'flex', gap: compact ? 10 : 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {characters.map(char => (
          <div
            key={char.id}
            onClick={() => handleSelect(char.id)}
            style={{
              width: compact ? 140 : 200,
              padding: compact ? 10 : 20,
              background: selectedId === char.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              border: `2px solid ${selectedId === char.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: char.available ? 'pointer' : 'not-allowed',
              opacity: char.available ? 1 : 0.5,
              transition: 'all var(--transition-fast)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: compact ? 28 : 48, marginBottom: compact ? 4 : 8 }}>{char.icon}</div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>{char.name}</h3>
            <p style={{ fontSize: 11, color: 'var(--accent-purple)', marginBottom: 8 }}>{char.title}</p>
            {char.available ? (
              <>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {char.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 12, flexWrap: 'wrap' }}>
                  <span>❤️ {char.hp}</span>
                  <span>⚡ {char.energy}</span>
                  <span>🃏 {char.starterDeckIds.length}</span>
                </div>
                {(() => {
                  const relic = char.starterRelicId ? getStarterRelic(char.id) : null;
                  return relic ? (
                    <div style={{
                      marginTop: 8,
                      padding: '4px 8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                    }}>
                      {relic.icon} {relic.name}
                    </div>
                  ) : null;
                })()}
              </>
            ) : (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Coming Soon...
              </p>
            )}
          </div>
        ))}
      </div>

      {preview && (
        <CardPreview card={preview.card} x={preview.x} y={preview.y} />
      )}

      {selectedChar && selectedChar.available && (
        <div className="animate-slide-up" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: compact ? 12 : 20,
          maxWidth: compact ? 500 : 600,
          width: '100%',
        }}>
          {(() => {
            const relic = selectedChar.starterRelicId ? getStarterRelic(selectedChar.id) : null;
            return relic ? (
              <div style={{
                marginBottom: 16,
                padding: 12,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{ fontSize: 28 }}>{relic.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{relic.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{relic.description}</div>
                </div>
              </div>
            ) : null;
          })()}
          <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--text-secondary)' }}>
            Starter Deck ({selectedChar.starterDeckIds.length} cards)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedChar.starterDeckIds.map((cardId, i) => {
              const card = getCardDef(cardId);
              if (!card) return null;
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              return (
                <div
                  key={i}
                  onMouseEnter={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  onMouseLeave={() => setPreview(null)}
                  style={{
                    padding: '6px 10px',
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12,
                    maxWidth: 140,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'default',
                  }}
                >
                  <span>{card.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</span>
                  <span style={{ color: 'var(--energy-color)', fontSize: 10, flexShrink: 0 }}>({card.cost})</span>
                </div>
              );
            })}
          </div>
          <button
            className="primary"
            onClick={startRun}
            disabled={!run}
            style={{ marginTop: compact ? 10 : 16, width: '100%', padding: compact ? 8 : 12, fontSize: compact ? 13 : 16 }}
          >
            {'>'} Start Run _
          </button>
        </div>
      )}
    </div>
  );
};
