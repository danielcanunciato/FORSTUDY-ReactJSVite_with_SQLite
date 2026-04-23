// CREATE API, SET A HOST PORT AND IMPORT PACKAGES
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require('jsonwebtoken');
const cors = require("cors");

require('dotenv').config();

const SECRET = process.env.JWT_SECRET || "uma_sequencia_muito_longa_e_aleatoria_12345";

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

const checkAuth = (authorizedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({error: "No token specified."});

        jwt.verify(token, SECRET, (err, decoded)=>{
            if (err) return res.status(403).json({error: "Invalid Token."});

            if (authorizedRoles.includes(decoded.role)) {
                req.id = decoded.id;
                req.username = decoded.username;
                req.role = decoded.role;
                next();
            } else {
                return res.status(403).json({error: "Insufficient Permission."})
            }
        })
    }
}

// HOME
API.get("/", (req,res)=>{

    // AUTO-DEV CREATION FOR TEST PURPOSES
    db.get(
        `SELECT * FROM bd_users WHERE username = ?`, ["DEVTEST"], function(err, row) {
            if (err) return res.status(500).json({error:err.message});
            
            if (!row) {
                db.run(`
                    INSERT OR IGNORE INTO bd_users (id, username, password, role) VALUES (1, 'DEVTEST','DEVTEST123','mst')`
                )
            }
        }
    )
    
    res.status(200).send("Hello World!")
})

// USERS
API.post("/login", (req,res)=>{
    const { username, password } = req.body;

    const query = `SELECT id, username, role FROM bd_users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, user)=>{
        if (err) return res.status(500).json({error: err.message});
        if (!user) return res.status(401).json({error: "Wrong credentials."});

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role,
        }, SECRET, { expiresIn: '1h' });

        return res.status(200).json({auth: true, token: token});

    })
});

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

API.get("/users/:id", (req,res)=>{
    const userID = req.params.id

    db.get(
        `SELECT * FROM bd_users WHERE id = ?`, [userID], function (err, row) {
            if (err) return res.status(500).json({error: err.message});
            if (!row) return res.status(404).json({error: "User of that id does not exist."});

            res.status(200).json(row);
        }
    )
})

API.post("/users", checkAuth(["mst"]), (req,res)=>{
    const { userName, userPass, userRole } = req.body;
    
    db.run(
        `INSERT INTO bd_users (username, password, role) VALUES (?, ?, ?)`, [userName, userPass, userRole], function(err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({error: "User already exists."});
                } else { 
                    return res.status(500).json({error: err.message});
                }
            }
            
            res.status(201).json({message: "User createad successfully", data: { user: userName, pass: userPass, role: userRole }});
        }
    )
})

API.delete("/users/:id", checkAuth(["mst"]), (req,res)=>{
    const deleteID = req.params.id;
    const getClientID = req.id;

    if (parseInt(deleteID) === getClientID) {
        return res.status(400).json({error: "You can't delete yourself."});
    }

    db.get(
        `SELECT username FROM bd_users WHERE id = ?`, [deleteID], (err,user)=>{
            if (err) return res.status(500).json({error: err.message});
            if (!user) return res.status(404).json({error: "User not found."});

            if (user.username === "DEVTEST") {
                return res.status(403).json({error: "System user cannot be deleted."});
            }

            db.run(
                `DELETE FROM bd_users WHERE id = ?`, [deleteID], function(err){
                    if (err) return res.status(500).json({error: err.message});
                    res.status(200).json({success: "Deleted user successfully",
                        data_deleted : {
                            id: deleteID,
                            name: user.username
                        }
                    })
                }
            )
        }
    )
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
        `SELECT * FROM bd_clients WHERE id = ?`, [req.params.id], function(err, row){
            if (err) return res.status(500).json({error:err.message});
            if (!row) return res.status(404).json({error:"User not found"});
            res.status(200).json(row)
        }
    )
})

API.post("/clients", checkAuth(["adm", "mst"]), (req,res)=>{
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

API.post("/products", checkAuth(["mst"]), (req, res) => {
    const { name, price, clientName } = req.body;

    if (!name || !price || !clientName) {
        return res.status(400).json({ error: "Missing fields" });
    }

    db.get(
        `SELECT id FROM bd_clients WHERE name = ?`,
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