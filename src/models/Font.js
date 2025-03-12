const mongoose = require('mongoose');

const FontSchema = new mongoose.Schema({
    fontName: {type: String, required: true},
    fontStyle: {type: String, required: true},
    fontCost: {type: Number, required: true},
    fontColor: {type: String, required: true}
});

const Font = mongoose.model('Font', FontSchema);

module.exports = { Font, FontSchema };