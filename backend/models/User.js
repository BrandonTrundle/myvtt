const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
