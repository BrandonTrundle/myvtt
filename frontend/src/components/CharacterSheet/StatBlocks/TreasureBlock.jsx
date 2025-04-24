const TreasureBlock = ({ values, onChange }) => {
  const treasures = values.treasure || [];
  const coins = values.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

  const addTreasure = () => {
    const updated = [...treasures, ''];
    onChange({ target: { name: 'treasure', value: updated } });
  };

  const updateTreasure = (index, value) => {
    const updated = [...treasures];
    updated[index] = value;
    onChange({ target: { name: 'treasure', value: updated } });
  };

  const removeTreasure = (index) => {
    const updated = treasures.filter((_, i) => i !== index);
    onChange({ target: { name: 'treasure', value: updated } });
  };

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
