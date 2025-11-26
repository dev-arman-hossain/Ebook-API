import express from "express";

const app = express();


//Routes
// http methods

app.get("/", (req, res) => {
    res.json({ message: "Welcome to elib apis" });
});




export default app;