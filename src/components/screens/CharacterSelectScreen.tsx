import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { characters } from '../../data/characters';
import { getCardDef } from '../../data/cards';
import { Tooltip } from '../common/Tooltip';

export const CharacterSelectScreen: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      justifyContent: 'center',
      gap: 32,
      padding: 32,
    }} className="animate-fade-in">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, color: 'var(--accent-cyan)', marginBottom: 8 }}>
          {'>'} The Last Software Engineer _
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Choose your class to begin
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        {characters.map(char => (
          <div
            key={char.id}
            onClick={() => handleSelect(char.id)}
            style={{
              width: 200,
              padding: 20,
              background: selectedId === char.id ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              border: `2px solid ${selectedId === char.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-lg)',
              cursor: char.available ? 'pointer' : 'not-allowed',
              opacity: char.available ? 1 : 0.5,
              transition: 'all var(--transition-fast)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>{char.icon}</div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>{char.name}</h3>
            <p style={{ fontSize: 11, color: 'var(--accent-purple)', marginBottom: 8 }}>{char.title}</p>
            {char.available ? (
              <>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {char.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
                  <span>❤️ {char.hp}</span>
                  <span>⚡ {char.energy}</span>
                </div>
              </>
            ) : (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Coming Soon...
              </p>
            )}
          </div>
        ))}
      </div>

      {selectedChar && selectedChar.available && (
        <div className="animate-slide-up" style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          maxWidth: 600,
          width: '100%',
        }}>
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
                <Tooltip key={i} text={card.description}>
                  <div style={{
                    padding: '6px 10px',
                    background: 'var(--bg-card)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'default',
                  }}>
                    <span>{card.icon}</span>
                    <span>{card.name}</span>
                    <span style={{ color: 'var(--energy-color)', fontSize: 10 }}>({card.cost})</span>
                  </div>
                </Tooltip>
              );
            })}
          </div>
          <button
            className="primary"
            onClick={startRun}
            disabled={!run}
            style={{ marginTop: 16, width: '100%', padding: 12, fontSize: 16 }}
          >
            {'>'} Start Run _
          </button>
        </div>
      )}
    </div>
  );
};
