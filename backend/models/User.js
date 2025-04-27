/**
 * Author: Brandon Trundle
 * File Name: User.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines the Mongoose schema and model for users in ArcanaTable.
 * Manages user authentication credentials, profile information,
 * subscription tier, onboarding progress, and play preferences.
 * Includes middleware to hash passwords and instance methods to verify passwords.
 */

const mongoose = require('mongoose'); // Mongoose library for MongoDB object modeling
const bcrypt = require('bcrypt'); // Library for hashing and comparing passwords securely

/**
 * Mongoose schema defining the structure of a User document.
 * 
 * Fields:
 * - firstName: User's first name (required)
 * - lastName: User's last name (required)
 * - email: Unique email address (required)
 * - password: Hashed user password (required)
 * 
 * - displayName: Public display name for UI
 * - avatarUrl: Path to user's avatar image
 * - subscriptionTier: Account subscription type (Free, Pro, Premium)
 * - hoursPlayed: Tracks user's total time played
 * 
 * - language: Preferred language for onboarding and UI
 * - experienceLevel: TTRPG experience level (Beginner, Intermediate, Advanced)
 * - role: User's role (Player, GM, Both)
 * - groupType: Type of group user prefers
 * - playPreferences: Array of preferred play styles (Roleplay, Combat, etc.)
 * - onboardingComplete: Tracks if user completed onboarding flow
 * 
 * Automatically timestamps documents with createdAt and updatedAt.
 */
const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },

    // Account and UI display
    displayName:       { type: String },
    avatarUrl:         { type: String, default: '' },
    subscriptionTier:  {
      type: String,
      enum: ['Free', 'Pro', 'Premium'],
      default: 'Free',
    },
    hoursPlayed:       {
      type: Number,
      default: 0,
    },

    // Onboarding fields
    language:          { type: String, default: 'English' },
    experienceLevel:   { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    role:              { type: String, enum: ['Player', 'GM', 'Both'] },
    groupType:         { type: String },
    playPreferences:   [{ type: String }],
    onboardingComplete:{ type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

/**
 * Pre-save middleware to hash user's password before saving to the database.
 * Only hashes if the password field is modified.
 * 
 * @param {Function} next - Callback to move to the next middleware or save operation.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method to compare an entered password with the hashed password stored in the database.
 * 
 * @param   {String} enteredPassword - Plaintext password entered by user
 * @returns {Promise<Boolean>} - Resolves true if passwords match, false otherwise
 */
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
