/**
 * Author: Brandon Trundle
 * File Name: TreasureBlock.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides input fields for managing a character's treasure inventory,
 * including coin amounts and a customizable list of valuable items found during adventures.
 */

import React from 'react'; // React library for building dynamic form and list components


/**
 * TreasureBlock Component
 * 
 * Purpose:
 * Renders editable fields for recording the character's carried coins and special treasure items.
 * 
 * Props:
 * @param {Object} values - Object containing the character's coin counts and treasure items.
 * @param {Function} onChange - Callback function to update the parent form state when coins or treasures change.
 * 
 * Behavior:
 * - Displays editable number inputs for each coin type (CP, SP, EP, GP, PP).
 * - Allows adding, editing, and removing treasure item descriptions dynamically.
 */
const TreasureBlock = ({ values, onChange }) => {
  const treasures = values.treasure || [];
  const coins = values.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

/**
 * Adds a new blank treasure item to the list.
 */
  const addTreasure = () => {
    const updated = [...treasures, ''];
    onChange({ target: { name: 'treasure', value: updated } });
  };

/**
 * Updates the description of a specific treasure item.
 * 
 * @param {number} index - Index of the treasure item being edited.
 * @param {string} value - New description for the treasure item.
 */
  const updateTreasure = (index, value) => {
    const updated = [...treasures];
    updated[index] = value;
    onChange({ target: { name: 'treasure', value: updated } });
  };

/**
 * Removes a treasure item from the list.
 * 
 * @param {number} index - Index of the treasure item to remove.
 */
  const removeTreasure = (index) => {
    const updated = treasures.filter((_, i) => i !== index);
    onChange({ target: { name: 'treasure', value: updated } });
  };
  
/**
 * Updates the quantity of a specific type of coin.
 * 
 * @param {string} coin - Coin type (cp, sp, ep, gp, or pp).
 * @param {number|string} value - New amount for the coin type.
 */
  const updateCoin = (coin, value) => {
    const updated = { ...coins, [coin]: Number(value) };
    onChange({ target: { name: 'coins', value: updated } });
  };

  return (
    <div className="treasure-block">
      <div className="textblock-label">Treasure</div>

      {/* Coin Inputs */}
      <div className="coin-inputs">
        {['cp', 'sp', 'ep', 'gp', 'pp'].map((coin) => (
          <div className="coin-field" key={coin}>
            <label htmlFor={coin}>{coin.toUpperCase()}</label>
            <input
              type="number"
              name={`coins-${coin}`}
              className="coin-input"
              min="0"
              value={coins[coin]}
              onChange={(e) => updateCoin(coin, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Treasure Items */}
      <div className="treasure-items">
        {treasures.map((item, index) => (
          <div key={index} className="treasure-row">
            <input
              name={`treasure-${index}`}
              value={item}
              className="equipment-name-input"
              onChange={(e) => updateTreasure(index, e.target.value)}
              placeholder="Treasure Item Description"
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeTreasure(index)}
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="add-equipment-btn" onClick={addTreasure}>
          Add Treasure
        </button>
      </div>
    </div>
  );
};

export default TreasureBlock;
