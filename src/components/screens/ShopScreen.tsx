import React, { useMemo, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { cards } from '../../data/cards';
import { getShopItems } from '../../data/items';
import { getShopConsumables } from '../../data/consumables';
import { useMobile } from '../../hooks/useMobile';

export const ShopScreen: React.FC = () => {
  const { compact } = useMobile();
  const { run, buyCard, buyItem, buyConsumable, removeCard, returnToMap } = useGameStore();
  const [removeMode, setRemoveMode] = useState(false);
  const [soldCards, setSoldCards] = useState<Set<string>>(new Set());
  const [soldConsumables, setSoldConsumables] = useState<Set<string>>(new Set());

  const characterId = run?.character?.id;

  const shopCards = useMemo(() => {
    // Class-gated: show class cards + neutral cards only
    const classId = characterId === 'frontend_dev' ? 'frontend'
      : characterId === 'backend_dev' ? 'backend'
      : characterId === 'architect' ? 'architect'
      : characterId === 'ai_engineer' ? 'ai_engineer' : undefined;
    const pool = Object.values(cards).filter(c => {
      if (c.rarity === 'starter' || c.rarity === 'curse') return false;
      if (!classId) return true;
      return !c.class || c.class === classId;
    });
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [characterId]);

  const shopItems = useMemo(() => getShopItems(3, characterId), [characterId]);
  const shopConsumableItems = useMemo(() => getShopConsumables(run?.act || 1, 2), [run?.act]);

  if (!run) return null;

  const getCardCost = (rarity: string) =>
    rarity === 'common' ? 50 : rarity === 'rare' ? 75 : rarity === 'epic' ? 125 : rarity === 'legendary' ? 200 : 75;

  const getItemCost = (rarity: string) =>
    rarity === 'common' ? 100 : rarity === 'rare' ? 150 : rarity === 'epic' ? 225 : rarity === 'legendary' ? 350 : 150;

  const getConsumableCost = (rarity: string) =>
    rarity === 'common' ? 40 : rarity === 'rare' ? 65 : rarity === 'epic' ? 100 : rarity === 'legendary' ? 160 : 65;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: compact ? 12 : 24,
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
          const sold = soldCards.has(card.id);
          const canAfford = run.gold >= cost && !sold;
          const borderColor = card.type === 'attack' ? 'var(--card-attack)'
            : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
          return (
            <div
              key={card.id}
              onClick={() => canAfford && (() => { buyCard(card.id); setSoldCards(prev => new Set(prev).add(card.id)); })()}
              style={{
                width: compact ? 100 : 130,
                padding: compact ? 8 : 12,
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
              <div style={{ color: 'var(--gold-color)', fontSize: 13, fontWeight: 'bold' }}>
                {sold ? 'SOLD' : `💰 ${cost}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Artifacts for sale */}
      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Artifacts</h3>
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
                width: compact ? 100 : 140,
                padding: compact ? 8 : 12,
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

      {/* Consumables for sale */}
      <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Consumables</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {shopConsumableItems.map(c => {
          const cost = getConsumableCost(c.rarity);
          const sold = soldConsumables.has(c.id);
          const canAfford = run.gold >= cost && !sold;
          const slotsFull = run.consumables.length >= run.maxConsumables;
          const rarityColor = c.rarity === 'legendary' ? 'var(--accent-gold)' : c.rarity === 'epic' ? 'var(--accent-yellow)' : c.rarity === 'rare' ? 'var(--accent-blue)' : 'var(--text-secondary)';
          return (
            <div
              key={c.id}
              onClick={() => canAfford && !slotsFull && (() => { buyConsumable(c.id); setSoldConsumables(prev => new Set(prev).add(c.id)); })()}
              style={{
                width: compact ? 100 : 140,
                padding: compact ? 8 : 12,
                background: 'var(--bg-card)',
                border: `1px solid ${rarityColor}`,
                borderRadius: 'var(--radius-md)',
                cursor: canAfford && !slotsFull && !sold ? 'pointer' : 'not-allowed',
                opacity: canAfford && !slotsFull && !sold ? 1 : 0.5,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>{c.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6 }}>{c.description}</div>
              <div style={{ color: 'var(--gold-color)', fontSize: 13, fontWeight: 'bold' }}>
                {sold ? 'SOLD' : slotsFull ? 'SLOTS FULL' : `💰 ${cost}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remove card */}
      {(() => {
        const discount = run.items.reduce((sum: number, item: any) => sum + (item.effect.cardRemovalDiscount || 0), 0);
        const removalCost = Math.max(0, 75 - discount);
        return (
          <>
            <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
              Remove a Card (💰 {removalCost})
            </h3>
            {!removeMode ? (
              <button
                onClick={() => setRemoveMode(true)}
                disabled={run.gold < removalCost || run.deck.length <= 1}
                style={{ width: 'fit-content' }}
              >
              Browse deck to remove...
              </button>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12, maxHeight: compact ? '50vh' : '55vh', overflowY: 'auto', padding: '4px 2px' }}>
                  {run.deck.map(card => {
                    const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                      : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
                    return (
                      <div
                        key={card.instanceId}
                        onClick={() => removeCard(card.instanceId)}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}
                        style={{
                          width: compact ? 100 : 130,
                          padding: compact ? 8 : 10,
                          background: 'var(--bg-card)',
                          border: `1px solid ${borderColor}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{card.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>{card.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--energy-color)', marginBottom: 4 }}>⚡{card.cost}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{card.description}</div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setRemoveMode(false)} style={{ fontSize: 12 }}>Cancel</button>
              </div>
            )}
          </>
        );
      })()}

    </div>
  );
};
