import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { mongoDbconnnection } from "./dbConnection.js";
import { User } from "./Shema.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

app.post("/signupDetails", async (req, res) => {
  const data = req.body;
  console.log(data);
  const { name, phoneNumber, email, password } = data;
  try {
    const { user_details } = await mongoDbconnnection();
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      console.log("Already user Exists !");
      return res.status(400).json({ message: "user Already Exists!" });
    }
    const newUser = new User({ name, phoneNumber, email, password });

    await user_details.insertOne(newUser);
    res.status(200).json({ message: "user successfully inserted into the db" });
  } catch (e) {
    console.log(e);
  }
});

app.post("/signinDetails", (req, res) => {
  const params = req.body;
  console.log(params);
});

mongoDbconnnection();

app.listen(3820, () => {
  console.log("server running on  port 3820");
});
