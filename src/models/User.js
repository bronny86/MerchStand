const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    bandName: { type: String, required: true },
    label: { type: String },
    genre: { type: String },
    location: { type: String },
    contactEmail: { type: String, required: true, unique: true },
    contactPhone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user'  // Default to 'user' unless specified as 'admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
