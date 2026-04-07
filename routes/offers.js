const express = require('express');
const pool = require('../helpers/database');
const router = express.Router();

router.post('/addBoatOffer', async function (req, res) {

    try {
        const { boatName, website, phoneNumber, latitude, longitude, dailyPrice, openingTime, imageName, vendorId } = req.body;
        const sqlQuery = 'INSERT INTO hausbootangebot (name, webseite, telefon, breitengrad, laengengrad, mietpreis, oeffnungszeiten, anbieter_id, bild) VALUES (?,?,?,?,?,?,?,?,?)';
        const result = await pool.query(sqlQuery, [boatName, website, phoneNumber, latitude, longitude, dailyPrice, openingTime, vendorId, imageName]);
        if (result.affectedRows >= 1) {
            res.status(200).send();
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;