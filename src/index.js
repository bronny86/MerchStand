// Import the configured server 
// and run it 
// At the very top of your entry file
require('dotenv').config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

const dotenv = require("dotenv");
dotenv.config();

const { app } = require("./server");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
