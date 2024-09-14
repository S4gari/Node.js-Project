const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User, mongoose } = require('./config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

const JWT_SECRET = "your_secret_key"; 

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password',
    },
});



// Display login page
app.get("/", (req, res) => {
    console.log("Rendering login page");
    res.render("login", { message: null });
});

// Display signup page
app.get("/signup", (req, res) => {
    console.log("Rendering signup page");
    res.render("signup", { message: null });
});

// Display home page
app.get("/home", (req, res) => {
    console.log("Rendering home page");
    res.render("home");
});

// Signup route with password hashing and uniqueness check
app.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;

    console.log("Signup request received:", { username, email });

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ name: username });

        if (existingUser) {
            console.log("User already exists:", existingUser);
            // If user exists, render the signup page with an error message
            res.render("signup", { message: "User already exists. Please choose a different username." });
        } else {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user with the hashed password
            const newUser = new User({
                name: username,
                password: hashedPassword,
                email: email,
            });

            // Save the new user to the database
            await newUser.save();

            console.log("User created:", newUser);

            // Send confirmation email
            const mailOptions = {
                from: 'your_email@gmail.com',
                to: newUser.email,
                subject: 'Signup Confirmation',
                text: `Hello ${newUser.name},\n\nThank you for signing up! Your account has been successfully created.\n\nBest regards,\nYour App Team`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error sending email:", error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

            // Render the login page with a success message
            res.render("login", { message: "Signup successful. Please check your email for confirmation." });
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.render("signup", { message: "An error occurred. Please try again." });
    }
});

// Login route with password verification and JWT generation
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("Login request received:", { username });

    try {
        // Check if user exists
        const user = await User.findOne({ name: username });

        if (user) {
            console.log("User found:", user);

            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log("Password match, generating token");
                // Passwords match, generate a JWT token
                const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

                // Send the token in the response
                res.json({ message: "Login successful", token });
            } else {
                console.log("Incorrect password");
                // Passwords do not match
                res.render("login", { message: "Incorrect password. Please try again." });
            }
        } else {
            console.log("User does not exist");
            // User does not exist
            res.render("login", { message: "User does not exist. Please sign up." });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.render("login", { message: "An error occurred. Please try again." });
    }
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).json({ message: "Invalid token." });
    }
};

// Profile route, protected by JWT
app.get("/profile", authMiddleware, async (req, res) => {
    console.log("Profile request received for userId:", req.user.userId);

    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
