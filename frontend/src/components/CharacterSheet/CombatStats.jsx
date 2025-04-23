// CombatStats.jsx

import React from 'react';

const CombatStats = () => {
  const stats = [
    { name: 'ac', label: 'Armor Class', placeholder: '10' },
    { name: 'initiative', label: 'Initiative', placeholder: '+0' },
    { name: 'speed', label: 'Speed', placeholder: '30' }
  ];

  return (
    <div className="combat-stats-box">
      <div className="combat-stats">
        {stats.map(stat => (
          <div key={stat.name} className="combat-stat-box">
            <label htmlFor={stat.name} className="combat-label">
              {stat.label}
            </label>
            <input
              type="text"
              name={stat.name}
              placeholder={stat.placeholder}
              className="combat-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatStats;