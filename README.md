**Node.js User Authentication API**🔐:
            This project is a Node.js API that provides endpoints for **user authentication** (signup and login) and **user profile management**. It is built using **Express.js** 🛠️ and **MongoDB** 🗄️ for data storage. Additionally, the API sends **confirmation emails** 📧 to users upon successful registration.
Features✨:
**User Signup** 📝  
  **Endpoint**: `/api/signup`  
  Allows users to register with a **username**, **email**, and **password**.  
  Validates input, hashes the password 🔑, and securely stores user data in MongoDB.  
  Sends a **confirmation email** 📩 upon successful signup.
**User Login** 🔓  
  **Endpoint**: `/api/login`  
  Validates user credentials (email and password).  
  Generates a **JWT token** 🛡️ for authentication, which is sent back to the client.
**User Profile** 👤  
  **Endpoint**: `/api/home`  
  Retrieves and displays the user's profile information using the **JWT token** provided.
**Confirmation Email** ✅  
  A **confirmation email** is sent after successful user signup using **Nodemailer**.  
  The email contains a **confirmation link** 🔗 to verify the user's registration.

Technologies Used 🖥️:

- **Node.js**: JavaScript runtime for building the API.
- **Express.js**: Web framework used to create the server and define the routes.
- **MongoDB**: Database for storing user information.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB.
- **JWT (JSON Web Token)**: For securely transmitting information between parties.
- **Bcrypt.js**: For hashing passwords 🔒 before storing them in the database.
- **Nodemailer**: To send confirmation emails 📬 to users after signup.

