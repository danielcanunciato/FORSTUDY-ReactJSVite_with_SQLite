const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const API = express();
const PORT = 4400;

API.use(cors());
API.use(express.json());

const db = new sqlite3.Database("./database/main.db", (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
});

db.run(`
CREATE TABLE IF NOT EXISTS bd_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
)`);

db.run(`
CREATE TABLE IF NOT EXISTS bd_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientid INT,
    name TEXT UNIQUE,
    price INT,
    FOREIGN KEY (clientid) REFERENCES bd_users(id)
)`);

API.get("/", (req,res)=>{res.status(200).send("Hello World!")})

API.get("/users", (req,res)=>{
    db.all(
        `SELECT * FROM bd_users`, [], (err, rows) => {
            if (err) return res.status(500).json({error: err.message});

            res.status(200).json(rows);
        }
    )
})

API.post("/users", (req,res)=>{
    const new_client = req.query.clientName;

    if (!new_client) { return res.status(400).json({error: 'Missing fields'}) };

    db.get(
        `SELECT * FROM bd_users WHERE name = ?`, [new_client], (err, row) => {
            if (err) return res.status(500).json({error: err.message});

            if (row) return res.status(409).json({error: 'Client already exists'});

            db.run(
                `INSERT INTO bd_users (name) VALUES (?)`, [new_client], function (err) {
                    if (err) return res.status(500).json({error: err.message});
                    res.status(201).json({
                        message: "Client created successfully",
                        data: {
                            id: this.lastID,
                            name: new_client
                        }
                    })
                }
            )
        }
    )
})

API.get("/products", (req, res) => {
    db.all(`SELECT * FROM bd_products`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(rows);
    });
});

API.post("/products", (req, res) => {
    const { name, price, clientName } = req.body;

    if (!name || !price || !clientName) {
        return res.status(400).json({ error: "Missing fields" });
    }

    db.get(
        `SELECT id FROM bd_users WHERE name = ?`,
        [clientName],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!row) {
                return res.status(404).json({
                    error: `Client ${clientName} not found`
                });
            }

            const client_id = row.id;

            // insert product
            db.run(
                `INSERT INTO bd_products (clientid, name, price) VALUES (?, ?, ?)`,
                [client_id, name, price],
                function (err) {
                    if (err) {
                        if (err.message.includes("UNIQUE")) {
                            return res.status(409).json({
                                error: "Product already exists"
                            });
                        }

                        return res.status(500).json({ error: err.message });
                    }

                    res.status(201).json({
                        message: "Product created",
                        id: this.lastID
                    });
                }
            );
        }
    );
});

API.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});