require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./routes/authroutes');
const dealRouter = require('./routes/dealroutes');
const claimRouter = require('./routes/claimroutes');
const connectDB = require('./utils/db');

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//middleware
app.use(express.json());
app.use("/api/deals", dealRouter);
app.use("/api/claims", claimRouter);


app.use("/api/auth", router);
app.get("/", (req, res) => {
  res.send("Backend is running correctly"); 
});

const PORT = process.env.PORT ;
connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
});
