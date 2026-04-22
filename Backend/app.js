require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cors({
   origin: 'http://localhost:5173'
}));

app.use(express.static(path.join(__dirname, "Frontend")));
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use('/api/auth/', authRoutes);
app.use("/api/users/", userRoutes)

app.listen(5000, () => {
   console.log("Server is Listining");
})