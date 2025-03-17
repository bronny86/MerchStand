const mongoose = require('mongoose');

const getDatabaseDump = async (req, res) => {
    const dumpContainer = {};
    try {
        let collections = await mongoose.connection.db.listCollections().toArray();
        collections = collections.map((collection) => collection.name);

        for (const collectionName of collections) {
            let collectionData = await mongoose.connection.db.collection(collectionName).find({}).toArray();
            dumpContainer[collectionName] = collectionData;
        }

        console.log("Dumping database data: \n" + JSON.stringify(dumpContainer, null, 4));
        res.json({ data: dumpContainer });
    } catch (error) {
        console.error("Error fetching database dump:", error);
        res.status(500).json({ message: 'Error fetching database dump', error: error.message });
    }
};

module.exports = {
    getDatabaseDump,
};
