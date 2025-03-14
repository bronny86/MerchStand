// models/Design.js
const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
    textContent: {type: String, required: true},
    fontSize: {type: Number, required: true},
    position: {type: String, required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    font: {type: mongoose.Types.ObjectId, ref: 'Font'},
    clipArt: {type: mongoose.Types.ObjectId, ref: 'ClipArt'}
});

const Design = mongoose.model('Design', DesignSchema);

module.exports = { Design, DesignSchema };
