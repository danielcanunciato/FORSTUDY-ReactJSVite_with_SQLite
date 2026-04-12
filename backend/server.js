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

API.get("/users/:id", (req,res)=>{
    db.get(
        `SELECT * FROM bd_users WHERE id = ?`, [req.params.id], function(err, row){
            if (err) return res.status(500).json({error:err.message});
            if (!row) return res.status(404).json({error:"User not found"});
            res.status(200).json(row)
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

API.get("/products", (req,res)=>{
    const query = `
        SELECT
            p.id AS product_id,
            p.name AS product_name,
            p.clientid,
            u.name AS client_name
        FROM bd_products p
        JOIN bd_users u ON p.clientid = u.id
    `;

    db.all(query, [], (err,rows)=>{
        if (err) return res.status(500).json({error: err.message});

        res.status(200).json(rows);
    })
})

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

API.get("/products/:clientID", (req,res) => {
    const get_client_id = req.params.clientID

    db.get(
        `SELECT * FROM bd_products WHERE clientid = ?`, [get_client_id], (err, row) => {
            if (err) return res.status(500).json({error: err.message});
            if (!row) return res.status(404).json({error: "[ERR404] No client of that ID exists or have a product active"});
            
            let product_name = row.name;
            let product_id = row.id;

            db.get(
                `SELECT * FROM bd_users WHERE id = ?`, [get_client_id], (err, client) => {
                    if (err) return res.status(500).json({error: err.message});
                    if (!row) return res.status(404).json({error: "[ERR404] No client of that ID exists"});

                    res.status(200).json({
                        productName: product_name,
                        productID: product_id,
                        client_id: get_client_id,
                        client_name: client.name,
                    })
                }
            )
        }
    )
})

API.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});