// Controller function to handle data dump
const DataDump = require('../models/datadump');  // Corrected import with lowercase "d"
const mongoose = require('mongoose');

async function createDataDump(req, res) {
    try {
        // Get the list of all collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        const dumpContainer = {};

        // Loop through collections and store their data
        for (const collection of collections) {
            const collectionName = collection.name;
            const data = await mongoose.connection.db.collection(collectionName).find({}).toArray();
            
            dumpContainer[collectionName] = data;

            // Store the data dump in the database
            const dataDump = new DataDump({
                collectionName: collectionName,
                data: data
            });

            await dataDump.save();
        }

        // Respond with success message
        res.status(200).json({ message: "Database dump completed successfully.", dump: dumpContainer });
    } catch (error) {
        res.status(500).json({ message: "Error during database dump", error: error.message });
    }
}
