const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
  
    // Onboarding fields
    displayName:       { type: String },
    language:          { type: String, default: 'English' },
    experienceLevel:   { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    role:              { type: String, enum: ['Player', 'GM', 'Both'] },
    groupType:         { type: String }, // e.g., "Friends", "Online-only", etc.
    playPreferences:   [{ type: String }], // e.g., ["Combat", "Roleplay", "Puzzles"]
    onboardingComplete: { type: Boolean, default: false }

  });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
