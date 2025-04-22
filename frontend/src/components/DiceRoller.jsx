import React, { useState } from 'react';

const DiceRoller = ({ onRoll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDice, setSelectedDice] = useState('d20');
  const [quantity, setQuantity] = useState(1);
  const [modifier, setModifier] = useState(0);

  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

  const handleRoll = () => {
    onRoll({
      dice: selectedDice,
      quantity: Number(quantity),
      modifier: Number(modifier),
    });
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-arcanared text-white px-3 py-2 rounded-r mt-20 shadow-lg"
      >
        🎲
      </button>

      {isOpen && (
        <div className="w-64 bg-gray-800 text-white h-full shadow-xl p-4 flex flex-col gap-4 overflow-y-auto">
          <h3 className="text-xl font-bold">Dice Roller</h3>

          <div className="grid grid-cols-4 gap-2">
            {diceTypes.map((die) => (
              <button
                key={die}
                onClick={() => setSelectedDice(die)}
                className={`p-1 rounded border transition ${
                  selectedDice === die
                    ? 'bg-arcanared border-arcanared'
                    : 'border-gray-600'
                }`}
              >
                <img
                  src={`/${die}logo.png`}
                  alt={die}
                  className="w-12 h-12 object-contain mx-auto"
                />
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Number of Dice:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-700 border border-gray-600 p-2 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Modifier:</label>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(e.target.value)}
              className="bg-gray-700 border border-gray-600 p-2 rounded"
            />
          </div>

          <button
            onClick={handleRoll}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Roll
          </button>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
