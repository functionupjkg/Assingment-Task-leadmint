const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const logger = require("morgan");
const fs = require("fs-extra");
const path = require("path");
const app = express();
app.use(express.static("./resources"));
require("dotenv").config();


// Cookie-parser
const cookieParser = require("cookie-parser");

const db = require("./src/models");

app.use(cookieParser());

// Enable CORS for a specific origin;
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002",],
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(cors());

app.use(logger("dev"));

app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
// USER Routes Import

const userRoutes = require("./src/routes/route.js");

// -------ROUTES------- //

app.use("/api", userRoutes);




const { truncate } = require("fs/promises");



global.__basedir = __dirname;

// for parsing multipart/form-data
app.use(multer().single("file"));
app.use(multer().any());

const PORT = process.env.PORT || 3000;

db.sequelize
    .sync({
        alter: true,
    })
    .then((result) => {
        console.log("🧩🧩🧩🧩 Database Synced 🧩🧩🧩🧩");
        server = app.listen(PORT, () => {
            console.log("Server is spinning on port " + PORT);
        })

    })
    .catch((error) => {
        console.error("Unable to sync to the database:", error);
    });

app.use("/", async (req, res) => {
    res.send(
        res.send("Servers are UP and RUNNING !!!")
    );
}); 