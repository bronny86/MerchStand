const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/development-database";

// Function to wipe the database
const wipeDatabase = async () => {
    try {
        await mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to the database!");

        // Get all collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Drop each collection
        await Promise.all(
            collections.map((collection) => mongoose.connection.db.dropCollection(collection.name))
        );

        console.log("All collections dropped. Database is wiped.");

    } catch (error) {
        console.error("Error wiping the database:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Database connection closed.");
    }
};

// Run the wipe function
wipeDatabase();
