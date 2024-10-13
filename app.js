import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mongoDbconnnection } from "./dbConnection.js";
import { User } from "./Shema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = "venu"; 

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.post("/signupDetails", async (req, res) => {
  const { name, phoneNumber, email, password } = req.body;
  try {
    const { user_details } = await mongoDbconnnection();
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, phoneNumber, email, password: hashedPassword });
    // await user_details.insertOne(newUser);
    await newUser.save();
    
    res.status(200).json({ message: "User successfully inserted into the DB" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/signinDetails", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    
    res.status(200).json({ token, message: "Sign in successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Protected route (e.g., Home page after login)
app.get("/home", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the Home page!" });
});

mongoDbconnnection();

app.listen(3820, () => {
  console.log("Server running on port 3820");
});
