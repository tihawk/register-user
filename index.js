'use strict';
const express = require('express');

// Database
const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, 'sqlite.db')
let exists = fs.existsSync(dbFile);
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(dbFile);
const app = express();

app.use(express.static( path.join(__dirname, 'public') ));
app.use(express.json());
app.use(express.urlencoded());

app.listen(3000, () => {
    console.log("Server: Listening on port 3000");
});

// check if database file exists, and act accordingly
db.serialize(() => {
    if(!exists) {

        db.run(`CREATE TABLE Users 
            (firstName TEXT NOT NULL, 
            lastName TEXT NOT NULL, 
            address TEXT NOT NULL, 
            telNumber TEXT NOT NULL, 
            username TEXT PRIMARY KEY)`, (err)=> {
            if(err) {
                console.log(err.message);
            }
        });
        console.log('Created new table Users');
        db.serialize(() => {
            db.run(`INSERT INTO Users (firstName, lastName, address, telNumber, username) 
            VALUES ('test', 'tests', 'koiznae 1', '09873334441', 'testtests')`, (err) => {
                if(err) {
                    console.log(err.message);
                }
            });
        });
        
    } else {
        console.log('Database "Users" ready to go!');
        db.get('SELECT * from Users', (err, data) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log('first record:\n', data);
          }
        });
    }
});

db.close();

// PATHS
app.get('/', function(req, res) {
    res.sendFile( path.join(__dirname, '/index.html') );
  });

app.post('/user/register', (req, res) => {
    const db = new sqlite3.Database(dbFile);

    const sql = `INSERT INTO Users (firstName, lastName, address, telNumber, username)
                VALUES (?, ?, ?, ?, ?)`;

    const newUser = Object.values(req.body);

    db.run(sql, newUser, (err) => {
        if(err) {
            res.send(err.message);
        } else {
            res.send([this.lastID, req.body]);
        }
    });

    db.close();
});