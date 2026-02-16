import React from 'react';

interface EnergyOrbProps {
  current: number;
  max: number;
}

export const EnergyOrb: React.FC<EnergyOrbProps> = ({ current, max }) => {
  return (
    <div style={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #fde68a, #d97706, #92400e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--energy-color)',
      boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
      fontWeight: 'bold',
      fontSize: 20,
      color: '#fff',
      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      flexShrink: 0,
    }}>
      {current}/{max}
    </div>
  );
};
