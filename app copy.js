/* const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); */

// https://www.youtube.com/watch?v=zsnHIlsUPSU
import express from "express";
import mysql from "mysql";
import dateFormat, { masks } from "dateformat";
import bodyParser from "body-parser";
import StellarSdk from 'stellar-sdk';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 3050;
const app = express();
app.use(bodyParser.json());

// MySQL 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blockchaincore'
});

// Check connect
connection.connect(error => {
    if(error) throw error;
    console.log('Database server running.');
});



app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

// Route
app.get('/',(req, res) => {
    res.send('Welcome to my API.')
});

// Blockchains
app.get('/blockchains',(req, res) => {
    const sql = 'SELECT * FROM blockchains';

    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        } else{
            res.send('None blockchain.')
        }
    });
    
});

app.get('/blockchains/:id',(req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM blockchains WHERE id=${id}`;

    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        } else{
            res.send(`None blockchain with ID = ${id}.`)
        }
    });
});


app.post('/blockchain',(req, res) => {
    const now = new Date();
    const sql = 'INSERT INTO blockchains SET ?';
    const obj = {
        blockchain: req.body.blockchain,
        created_at: dateFormat(now, "yyyy-mm-dd hh:MM:ss")
    };

    connection.query(sql, obj, error => {
        if(error) throw error;
        res.send(`Blockchain created with ID = `)
    })
});

app.put('/blockchain/:id',(req, res) => {
    const now = new Date();
    const updated_at = dateFormat(now, "yyyy-mm-dd hh:MM:ss");
    const {id} = req.params;
    const {blockchain} = req.body;
    const sql = `UPDATE blockchains SET blockchain = "${blockchain}", updated_at = "${updated_at}" WHERE id=${id}`;
    
    connection.query(sql, error => {
        if(error) throw error;
        res.send(`Blockchain updated.`)
    })
});

app.delete('/blockchain/:id',(req, res) => {
    const {id} = req.params;
    const sql = `DELETE FROM blockchains WHERE id=${id}`;

    connection.query(sql, (error) => {
        if(error) throw error;
        res.send(`Blockchain deleted.`)
    });
});

// STELLAR

app.post('/stampHashStellar',(req, res) => {
    res.send('Welcome to stampHashStellar.')
});