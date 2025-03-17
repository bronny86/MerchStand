const mongoose = require('mongoose');

// Define the schema for DataDump
const dataDumpSchema = new mongoose.Schema({
    // The name of the collection being dumped
    collectionName: { 
        type: String, 
        required: true 
    },
    // The actual data from the collection
    data: {
        type: [mongoose.Schema.Types.Mixed], // Array of mixed data types (documents from the collection)
        required: true
    },
    // Date when the dump was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model for DataDump
module.exports = mongoose.model('DataDump', dataDumpSchema);
