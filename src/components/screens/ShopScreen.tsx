import React, { useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { cards } from '../../data/cards';
import { getShopItems } from '../../data/items';
import { CardPreview } from '../common/CardPreview';
import type { CardDef, CardInstance } from '../../types';

export const ShopScreen: React.FC = () => {
  const { run, buyCard, buyItem, removeCard, returnToMap } = useGameStore();
  const [removeMode, setRemoveMode] = useState(false);
  const [preview, setPreview] = useState<{ card: CardDef | CardInstance; x: number; y: number } | null>(null);

  const shopCards = useMemo(() => {
    const pool = Object.values(cards).filter(c => c.rarity !== 'starter');
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, []);

  const shopItems = useMemo(() => getShopItems(3), []);

  if (!run) return null;

  const getCardCost = (rarity: string) =>
    rarity === 'common' ? 50 : rarity === 'uncommon' ? 75 : 150;

  const getItemCost = (rarity: string) =>
    rarity === 'common' ? 100 : rarity === 'uncommon' ? 150 : 250;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 24,
      overflow: 'auto',
    }} className="animate-fade-in">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 22, color: 'var(--gold-color)' }}>$ Shop</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: 'var(--gold-color)', fontSize: 18 }}>💰 {run.gold}</span>
          <button onClick={returnToMap}>Leave Shop →</button>
        </div>
      </div>

      {/* Cards for sale */}
      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Cards</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {shopCards.map(card => {
          const cost = getCardCost(card.rarity);
          const canAfford = run.gold >= cost;
          const borderColor = card.type === 'attack' ? 'var(--card-attack)'
            : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
          return (
            <div
              key={card.id}
              onClick={() => canAfford && buyCard(card.id)}
              onMouseEnter={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
              }}
              onMouseLeave={() => setPreview(null)}
              style={{
                width: 130,
                padding: 12,
                background: 'var(--bg-card)',
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                cursor: canAfford ? 'pointer' : 'not-allowed',
                opacity: canAfford ? 1 : 0.5,
                textAlign: 'center',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{card.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>{card.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>{card.description}</div>
              <div style={{ color: 'var(--gold-color)', fontSize: 13, fontWeight: 'bold' }}>💰 {cost}</div>
            </div>
          );
        })}
      </div>

      {/* Items for sale */}
      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Items</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {shopItems.map(item => {
          const cost = getItemCost(item.rarity);
          const canAfford = run.gold >= cost;
          const owned = run.items.some(i => i.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => canAfford && !owned && buyItem(item.id)}
              style={{
                width: 140,
                padding: 12,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                cursor: canAfford && !owned ? 'pointer' : 'not-allowed',
                opacity: canAfford && !owned ? 1 : 0.5,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>{item.description}</div>
              <div style={{ color: 'var(--gold-color)', fontSize: 13, fontWeight: 'bold' }}>
                {owned ? 'OWNED' : `💰 ${cost}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remove card */}
      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
        Remove a Card (💰 75)
      </h3>
      {!removeMode ? (
        <button
          onClick={() => setRemoveMode(true)}
          disabled={run.gold < 75 || run.deck.length <= 1}
          style={{ width: 'fit-content' }}
        >
          Browse deck to remove...
        </button>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {run.deck.map(card => (
              <div
                key={card.instanceId}
                onClick={() => removeCard(card.instanceId)}
                onMouseEnter={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPreview({ card, x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => setPreview(null)}
                style={{
                  padding: '4px 8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--accent-red)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 11,
                }}
              >
                {card.icon} {card.name}
              </div>
            ))}
          </div>
          <button onClick={() => setRemoveMode(false)} style={{ fontSize: 12 }}>Cancel</button>
        </div>
      )}

      {preview && (
        <CardPreview card={preview.card} x={preview.x} y={preview.y} />
      )}
    </div>
  );
};
