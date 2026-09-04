const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['donor', 'receiver', 'admin', 'driver'], 
    required: true 
  },
  profileId: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role'   // dynamic reference to Donor/Receiver
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);