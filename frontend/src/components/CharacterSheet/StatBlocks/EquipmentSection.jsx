const EquipmentSection = ({ values, onChange }) => {
  const items = values.equipment || [{ name: '', desc: '' }];

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    onChange({
      target: {
        name: 'equipment',
        value: updated
      }
    });
  };

  const addItem = () => {
    const updated = [...items, { name: '', desc: '' }];
    onChange({
      target: {
        name: 'equipment',
        value: updated
      }
    });
  };

  return (
    <div className="equipment-section">
      <label className="equipment-label">Equipment</label>
      {items.map((item, index) => (
        <div className="equipment-item" key={index}>
          <input
            type="text"
            name={`equipment-name-${index}`}
            placeholder="Item Name"
            className="equipment-name-input"
            value={item.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />
          <textarea
            name={`equipment-desc-${index}`}
            placeholder="Description"
            className="equipment-desc-input"
            rows="2"
            value={item.desc}
            onChange={(e) => handleChange(index, 'desc', e.target.value)}
          />
        </div>
      ))}
      <button type="button" className="add-equipment-btn" onClick={addItem}>
        + Add Item
      </button>
    </div>
  );
};

export default EquipmentSection;
