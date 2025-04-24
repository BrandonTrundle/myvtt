const mongoose = require('mongoose');

const attackSchema = new mongoose.Schema({
  name: String,
  atk: String,
  damage: String,
  type: String
}, { _id: false }); // <== _id: false avoids nesting sub-documents with IDs

const skillSchema = new mongoose.Schema({
  name: String,
  stat: String,
  mod: String,
  proficient: Boolean
}, { _id: false });

const savingThrowSchema = new mongoose.Schema({
  attr: String,
  value: String,
  proficient: Boolean
}, { _id: false });

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  race: String,
  class: String,
  background: String,
  level: { type: Number, default: 1 },
  stats: {
    str: Number,
    dex: Number,
    con: Number,
    int: Number,
    wis: Number,
    cha: Number
  },
  backstory: String,
  system: { type: String, default: '5E' },
  isPublic: { type: Boolean, default: false },
  portraitImage: String,
  attacks: [attackSchema], // ✅ Proper embedded sub-schema
  skills: [skillSchema],
  savingThrows: [savingThrowSchema],
  combatStats: {
    ac: String,
    initiative: String,
    speed: String
  },
  hitPoints: {
    max: String,
    current: String,
    temp: String
  },
  deathSaves: {
    successes: [Boolean],
    failures: [Boolean]
  },
  traits: {
    personality: String,
    ideals: String,
    bonds: String,
    flaws: String
  },
  inspiration: String,
  proficiencyBonus: String
}, { timestamps: true });

module.exports = mongoose.models.Character || mongoose.model('Character', characterSchema);
