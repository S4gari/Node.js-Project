const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/login-tut", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.error("Database connection error:", err);
});

// Create a schema for user collection
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate usernames
    },
    password: {
        type: String,
        required: true
    },
    email: {  // New field for email
        type: String,
        required: true
    }
});

// Create a model for the user collection
const User = mongoose.model("User", LoginSchema);

// Export User model and mongoose connection
module.exports = { User, mongoose };
