const express = require("express");
const app = express();
const cors = require("cors")
const path = require("path");

app.use(cors({
   credentials: true,
   origin: 'https://localhost:5173'
}));

app.use(express.static(path.join(__dirname, "Frontend")));
app.use(express.urlencoded({extended: false}))
app.use(express.json());


app.listen(5000, () => {
   console.log("Server is Listining");
})