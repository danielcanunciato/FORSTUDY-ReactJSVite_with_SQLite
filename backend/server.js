// CREATE API, SET A HOST PORT AND IMPORT PACKAGES
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const API = express();
const PORT = 4400;

// STUFF FOR API TO USE
API.use(cors());
API.use(express.json());

// INITIALIZE DATABASE
const db = new sqlite3.Database("./database/main.db", (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
});

// CREATE TABLES
db.run(`
    CREATE TABLE IF NOT EXISTS bd_clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )`
);

// ROLES
/*
usr     : user: no access
adm     : admin: access to GET methods
mst     : master: access to all methods
*/

db.run(`
    CREATE TABLE IF NOT EXISTS bd_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        role TEXT DEFAULT 'usr'
    )
`)

db.run(`
    CREATE TABLE IF NOT EXISTS bd_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientid INT,
        name TEXT UNIQUE,
        price INT,
        FOREIGN KEY (clientid) REFERENCES bd_clients(id)
    )`
);

// HOME
API.get("/", (req,res)=>{res.status(200).send("Hello World!")})

// USERS
API.get("/users", (req,res)=>{
    db.all(
        `SELECT * FROM bd_users`, [], (err,rows)=>{
            if (err) return res.status(500).json({error: err.message});
            if (!rows) return res.status(404).json({error: 'Table not found'});
            if (!rows.length > 0) return res.status(200).json({success: 'Response delievered successfully, but the table is empty.'});

            res.status(200).json(rows)
        }
    )
})

API.post("/users", (req,res)=>{
    
})

// CLIENTS
API.get("/clients", (req,res)=>{
    db.all(
        `SELECT * FROM bd_clients`, [], (err, rows) => {
            if (err) return res.status(500).json({error: err.message});

            res.status(200).json(rows);
        }
    )
})

API.get("/clients/:id", (req,res)=>{
    db.get(
        `SELECT * FROM bd_users WHERE id = ?`, [req.params.id], function(err, row){
            if (err) return res.status(500).json({error:err.message});
            if (!row) return res.status(404).json({error:"User not found"});
            res.status(200).json(row)
        }
    )
})

API.post("/clients", (req,res)=>{
    const new_client = req.query.clientName;

    if (!new_client) { return res.status(400).json({error: 'Missing fields'}) };

    db.get(
        `SELECT * FROM bd_clients WHERE name = ?`, [new_client], (err, row) => {
            if (err) return res.status(500).json({error: err.message});

            if (row) return res.status(409).json({error: 'Client already exists'});

            db.run(
                `INSERT INTO bd_clients (name) VALUES (?)`, [new_client], function (err) {
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

// PRODUCTS
API.get("/products", (req,res)=>{
    const query = `
        SELECT
            p.id AS product_id,
            p.name AS product_name,
            p.price AS product_price,
            p.clientid,
            u.name AS client_name
        FROM bd_products p
        JOIN bd_clients u ON p.clientid = u.id
    `;

    db.all(query, [], (err,rows)=>{
        if (err) return res.status(500).json({error: err.message});

        res.status(200).json(rows);
    })
})

API.get("/products/:clientid", (req, res)=>{
    const { clientid } = req.params;

    const query = `
        SELECT
            p.id AS product_id,
            p.name AS product_name,
            p.clientid,
            u.name AS client_name
        FROM bd_products p
        JOIN bd_clients u ON p.clientid = u.id
        WHERE p.clientid = ?
    `;

    db.all(query, [clientid], (err,rows)=>{
        if (err) return res.status(500).json({error: err.message});
        if (!rows || rows.length == 0) return res.status(404).json({error: 'No product found for that client.'})

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

API.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});