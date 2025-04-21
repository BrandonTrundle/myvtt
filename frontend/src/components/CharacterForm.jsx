import React, { useState } from 'react';

const CharacterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: '',
    background: '',
    level: 1,
    stats: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    },
    backstory: '',
    system: '5E',
    isPublic: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        stats: { ...prev.stats, [name]: Number(value) }
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Character saved!');
        console.log('📘 Saved:', data);
        setFormData((prev) => ({ ...prev, name: '' })); // clear form or redirect later
      } else {
        alert('Something went wrong: ' + data.message);
      }
    } catch (err) {
      console.error('❌ Error saving character:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow border border-arcanabrown text-arcanadeep space-y-4">
      <h2 className="text-2xl font-bold">Create a Character</h2>

      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
      <input name="race" value={formData.race} onChange={handleChange} placeholder="Race" className="w-full p-2 border rounded" />
      <input name="class" value={formData.class} onChange={handleChange} placeholder="Class" className="w-full p-2 border rounded" />
      <input name="background" value={formData.background} onChange={handleChange} placeholder="Background" className="w-full p-2 border rounded" />
      <input name="level" type="number" min="1" value={formData.level} onChange={handleChange} placeholder="Level" className="w-full p-2 border rounded" />

      <div className="grid grid-cols-2 gap-2">
        {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
          <input
            key={stat}
            type="number"
            name={stat}
            value={formData.stats[stat]}
            onChange={handleChange}
            placeholder={stat.toUpperCase()}
            className="p-2 border rounded"
          />
        ))}
      </div>

      <textarea
        name="backstory"
        value={formData.backstory}
        onChange={handleChange}
        placeholder="Backstory"
        rows="4"
        className="w-full p-2 border rounded"
      />

      <input name="system" value={formData.system} onChange={handleChange} placeholder="System (e.g. 5E, Pathfinder)" className="w-full p-2 border rounded" />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} />
        Make public
      </label>

      <button type="submit" className="bg-arcanared text-white px-4 py-2 rounded hover:bg-arcanabrown transition">
        Save Character
      </button>
    </form>
  );
};

export default CharacterForm;
