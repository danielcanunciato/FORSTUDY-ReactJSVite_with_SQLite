const exp = require("express");
const sqlite = require('sqlite3');

const API = exp();
const PORT = 4400;

API.use(exp.json())

API.get("/", (req, res)=>{
    res.status(200).send("Hello World")
})

API.listen(PORT, ()=>{
    console.log(`API started running locally on http://localhost:${PORT}`)
})