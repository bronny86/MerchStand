// models/ClipArt.js
const mongoose = require('mongoose');

const ClipArtSchema = new mongoose.Schema({
    clipArtName: {type: String, required: true},
    clipArtCategory: {type: String, required: true},
    clipArtCreator: {type: String, required: true},
    clipArtCost: {type: Number, required: true},
    clipArtColor: {type: String, required: true}
});

const ClipArt = mongoose.model('ClipArt', ClipArtSchema);

module.exports = { ClipArt, ClipArtSchema };