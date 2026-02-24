import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMobile } from '../../hooks/useMobile';
import type { ItemDef } from '../../types';

export const BattleRewardScreen: React.FC = () => {
  const { compact } = useMobile();
  const { pendingRewards, pickRewardCard, skipRewardCards, claimArtifact, pickRewardConsumable, skipRewardConsumable, run } = useGameStore();
  const [artifactClaimed, setArtifactClaimed] = useState(false);
  const [consumableClaimed, setConsumableClaimed] = useState(false);

  if (!pendingRewards || !run) return null;

  const hasArtifacts = pendingRewards.artifactChoices && pendingRewards.artifactChoices.length > 0;
  const hasConsumables = pendingRewards.consumableChoices && pendingRewards.consumableChoices.length > 0;
  const isBoss = pendingRewards.isBossReward;
  const slotsFull = run.consumables.length >= run.maxConsumables;

  const handleClaimArtifact = (itemId: string) => {
    claimArtifact(itemId);
    setArtifactClaimed(true);
  };

  const hasNegativeEffect = (item: ItemDef) => {
    const e = item.effect;
    return !!(e.startBattleVulnerable || e.startBattleWeak || e.startBattleDamage || e.stressPerCombat);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: compact ? 'flex-start' : 'center',
      gap: compact ? 12 : 24,
      padding: compact ? 16 : 32,
      overflow: compact ? 'auto' : undefined,
    }} className="animate-fade-in">
      {pendingRewards.gold === 0 && pendingRewards.cardChoices.length === 0 && !hasArtifacts ? (
        <h2 style={{ fontSize: 24, color: 'var(--text-muted)' }}>&#128123; Ghosted...</h2>
      ) : (
        <h2 style={{ fontSize: 24, color: 'var(--accent-green)' }}>
          {isBoss ? 'Boss Defeated!' : 'Victory!'}
        </h2>
      )}

      {pendingRewards.gold === 0 && pendingRewards.cardChoices.length === 0 && !hasArtifacts && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', maxWidth: 300 }}>
          They vanished without a trace. No rewards. Not even a rejection email.
        </p>
      )}

      {/* Gold collected */}
      {pendingRewards.gold > 0 && (
        <span style={{ color: 'var(--gold-color)', fontSize: 16 }}>
          &#128176; +{pendingRewards.gold} gold (Total: {run.gold})
        </span>
      )}

      {/* Artifact choices */}
      {hasArtifacts && !artifactClaimed && (
        <>
          <h3 style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            {isBoss ? 'Choose an artifact:' : 'Artifact drop!'}
          </h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {pendingRewards.artifactChoices!.map(item => {
              const isDoublEdged = hasNegativeEffect(item);
              const borderColor = isDoublEdged ? '#e74c3c' : 'var(--accent-green)';
              return (
                <div
                  key={item.id}
                  onClick={() => handleClaimArtifact(item.id)}
                  style={{
                    width: 160,
                    padding: 14,
                    background: 'var(--bg-card)',
                    border: `2px solid ${borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {item.rarity}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>
          {!isBoss && (
            <button
              onClick={() => setArtifactClaimed(true)}
              style={{ fontSize: 12, color: 'var(--text-muted)' }}
            >
              Skip artifact
            </button>
          )}
          {isBoss && (
            <button
              onClick={() => setArtifactClaimed(true)}
              style={{ fontSize: 12, color: 'var(--text-muted)' }}
            >
              Skip artifact
            </button>
          )}
        </>
      )}

      {/* Consumable reward */}
      {hasConsumables && !consumableClaimed && (!hasArtifacts || artifactClaimed) && (
        <>
          <h3 style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Found a consumable!
          </h3>
          {slotsFull ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Consumable slots full ({run.consumables.length}/{run.maxConsumables})
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {pendingRewards.consumableChoices!.map(c => {
                const rarityColor = c.rarity === 'legendary' ? 'var(--accent-gold)' : c.rarity === 'epic' ? 'var(--accent-yellow)' : c.rarity === 'rare' ? 'var(--accent-blue)' : 'var(--text-secondary)';
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      pickRewardConsumable(c.id);
                      setConsumableClaimed(true);
                    }}
                    style={{
                      width: compact ? 100 : 150,
                      padding: compact ? 8 : 14,
                      background: 'var(--bg-card)',
                      border: `2px solid ${rarityColor}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{c.rarity}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{c.description}</div>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => {
              skipRewardConsumable();
              setConsumableClaimed(true);
            }}
            style={{ fontSize: 12, color: 'var(--text-muted)' }}
          >
            {slotsFull ? 'Continue' : 'Skip consumable'}
          </button>
        </>
      )}

      {/* Card choices */}
      {pendingRewards.cardChoices.length > 0 && (!hasArtifacts || artifactClaimed) && (!hasConsumables || consumableClaimed) && (
        <>
          <h3 style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Choose a card to add to your deck:</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {pendingRewards.cardChoices.map(card => {
              const borderColor = card.type === 'attack' ? 'var(--card-attack)'
                : card.type === 'skill' ? 'var(--card-skill)' : 'var(--card-power)';
              return (
                <div
                  key={card.id}
                  onClick={() => pickRewardCard(card.id)}
                  style={{
                    width: compact ? 120 : 160,
                    padding: compact ? 8 : 14,
                    background: 'var(--bg-card)',
                    border: `2px solid ${borderColor}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>{card.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 11, marginBottom: 6 }}>
                    <span style={{ color: 'var(--energy-color)' }}>&#9889;{card.cost}</span>
                    <span style={{ color: card.rarity === 'legendary' ? 'var(--accent-gold)' : card.rarity === 'epic' ? 'var(--accent-yellow)' : card.rarity === 'rare' ? 'var(--accent-blue)' : 'var(--text-muted)' }}>{card.rarity}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{card.description}</div>
                </div>
              );
            })}
          </div>
          <button onClick={skipRewardCards} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Skip card reward &#8594;
          </button>
        </>
      )}

      {pendingRewards.cardChoices.length === 0 && (!hasArtifacts || artifactClaimed) && (!hasConsumables || consumableClaimed) && (
        <button onClick={skipRewardCards} style={{ fontSize: 14, marginTop: 8 }}>
          Continue &#8594;
        </button>
      )}

    </div>
  );
};
