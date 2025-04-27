/**
 * Author: Brandon Trundle
 * File Name: EquipmentSection.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders a dynamic equipment list where users can add, edit, and describe items carried by their character.
 */

import React from 'react'; // React library for dynamic component rendering and form management

/**
 * EquipmentSection Component
 * 
 * Purpose:
 * Provides fields for users to input and manage a character's inventory, including item names and descriptions.
 * 
 * Props:
 * @param {Object} values - Object containing the character's current equipment data.
 * @param {Function} onChange - Callback function to propagate equipment updates to the parent form.
 * 
 * Behavior:
 * - Displays a list of existing equipment items with editable fields.
 * - Allows adding new blank equipment items dynamically.
 * - Updates the parent form's state whenever an item is edited or added.
 */
const EquipmentSection = ({ values, onChange }) => {
  const items = values.equipment || [{ name: '', desc: '' }];

/**
 * Handles updating a specific field of an equipment item.
 * 
 * @param {number} index - Index of the item in the equipment array.
 * @param {string} field - Either 'name' or 'desc' field being updated.
 * @param {string} value - New value entered by the user.
 */
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
  
/**
 * Adds a new blank equipment item to the list.
 */
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
