/**
 * Author: Brandon Trundle
 * File Name: Character.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines the Mongoose schema and model for player characters in ArcanaTable.
 * Represents comprehensive 5e Dungeons & Dragons character sheet data including:
 * - Core character information (name, class, race, level, etc.)
 * - Ability scores, saving throws, combat stats
 * - Skills, spellcasting, equipment, treasure, and personality traits
 * - Metadata including creator user ID and system information
 * 
 * Supports both detailed structured spellcasting and simplified text-area-based spell blocks.
 */

const mongoose = require('mongoose'); // Mongoose library for MongoDB object modeling
const { Schema } = mongoose; // Destructured Schema constructor for defining models

/**
 * Mongoose schema defining the structure of a Character document.
 * 
 * Major Sections:
 * - Identity: Basic information like character name, player name, class, level, and background
 * - Appearance: Physical and cosmetic attributes
 * - Ability Scores: Core STR, DEX, CON, INT, WIS, CHA stats and modifiers
 * - Saving Throws: Individual saves with proficiency flags
 * - Combat Stats: Armor class (AC), initiative, speed, and hit points
 * - Death Saves: Current status of death save successes and failures
 * - Attacks: List of attack actions with details
 * - Skills: List of skills with stat association and proficiency
 * - Proficiency/Inspiration: Global modifiers
 * - Spellcasting: Spell slots and detailed spell organization
 * - Allies and Organizations: Friends, organizations, and symbols
 * - Equipment and Treasure: Inventory, coins, and magic items
 * - Personality: Traits, ideals, bonds, flaws, and features
 * - Metadata: System name, backstory, public/private flag, creator reference
 * 
 * Includes automatic timestamping for creation and updates.
 */
const CharacterSchema = new Schema(
  {
    // Core identity
    name: { type: String }, // optional legacy field
    charname: { type: String },
    playername: String,
    class: String,
    level: Number,
    race: String,
    background: String,
    alignment: String,
    experiencepoints: Number,

    // Appearance and Social
    portraitImage: String,
    appearance: String,
    age: String,
    height: String,
    weight: String,
    eyes: String,
    skin: String,
    hair: String,

    // Ability Scores
    strscore: Number,
    strmod: Number,
    dexscore: Number,
    dexmod: Number,
    conscore: Number,
    conmod: Number,
    intscore: Number,
    intmod: Number,
    wisscore: Number,
    wismod: Number,
    chascore: Number,
    chamod: Number,

    // Saving Throws
    'strength-save': Number,
    'strength-save-prof': Boolean,
    'dexterity-save': Number,
    'dexterity-save-prof': Boolean,
    'constitution-save': Number,
    'constitution-save-prof': Boolean,
    'intelligence-save': Number,
    'intelligence-save-prof': Boolean,
    'wisdom-save': Number,
    'wisdom-save-prof': Boolean,
    'charisma-save': Number,
    'charisma-save-prof': Boolean,

    // Combat
    ac: Number,
    initiative: Number,
    speed: Number,
    maxhp: Number,
    currenthp: Number,
    temphp: Number,

    // Death Saves
    hitdice: String,
    'success-0': Boolean,
    'success-1': Boolean,
    'success-2': Boolean,
    'failure-0': Boolean,
    'failure-1': Boolean,
    'failure-2': Boolean,

    // Attacks
    attacks: {
      type: [
        {
          name: { type: String, default: '' },
          atk: { type: Schema.Types.Mixed },
          damage: { type: String, default: '' },
          type: { type: String, default: '' },
        }
      ],
      default: []
    },
    'attack-notes': String,

    // Skills
    skills: [
      {
        name: String,
        stat: String,
        mod: Schema.Types.Mixed,
        proficient: Boolean
      }
    ],

    // Proficiency + Inspiration
    inspiration: Schema.Types.Mixed,
    proficiencybonus: Number,

    // Spellcasting Core
    spellcastingClass: String,
    spellcastingAbility: String,
    spellSaveDC: Number,
    spellAttackBonus: Number,

    // Spellcasting Section
    spells: [
      {
        level: Number,
        slotsMax: Number,
        slotsUsed: Number,
        spells: [
          {
            name: String,
            desc: String
          }
        ]
      }
    ],

    // Simplified spell block fallback (textarea-based)
    spellSlots_1: Number,
    spellSlots_2: Number,
    spellSlots_3: Number,
    spellSlots_4: Number,
    spellSlots_5: Number,
    spellSlots_6: Number,
    spellSlots_7: Number,
    spellSlots_8: Number,
    spellSlots_9: Number,
    spells_0: String,
    spells_1: String,
    spells_2: String,
    spells_3: String,
    spells_4: String,
    spells_5: String,
    spells_6: String,
    spells_7: String,
    spells_8: String,
    spells_9: String,

    // Allies
    allies: String,
    orgName: String,
    orgSymbolImage: String,

    // Equipment
    equipment: [
      {
        name: String,
        desc: String
      }
    ],

    // Coins and Treasure
    coins: {
      cp: Number,
      sp: Number,
      ep: Number,
      gp: Number,
      pp: Number
    },
    treasure: [String],

    // Personality
    personalityTraits: String,
    ideals: String,
    bonds: String,
    flaws: String,
    features: String,
    additionalFeatures: String,

    // Wisdom block
    passiveWisdom: Number,
    otherProficiencies: String,

    // Metadata
    system: String,
    backstory: String,
    isPublic: Boolean,
    creator: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Character || mongoose.model('Character', CharacterSchema);

