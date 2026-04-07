const express = require('express');
const pool = require('../helpers/database');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
router.use(cookieParser());

router.get('/restaurants', async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM reisepunkt WHERE Art='Restaurant'";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/islands', async function (req, res) {
    try {
        const sqlQuery = 'SELECT * FROM insel';
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/landings', async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM reisepunkt WHERE Art='Anlegestelle'";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/supermarkets', async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM reisepunkt WHERE Art='Supermarkt'";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/attractions', async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM reisepunkt WHERE Art='Sehenswuerdigkeit'";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/swimming-places', async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM reisepunkt WHERE Art='Schwimmplatz'";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/island-rating', async function (req, res) {
    try {
        const sqlQuery = "SELECT insel.name AS Insel, insel.Kurzbeschreibung, Bewertung.Durchschnittsbewertung FROM insel, (SELECT Insel, ROUND(AVG(Bewertung),1) AS Durchschnittsbewertung FROM inselbewertung GROUP BY Insel ORDER BY Durchschnittsbewertung DESC) AS Bewertung WHERE Bewertung.Insel = insel.Name";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/erfahrungsberichte', async function(req, res) {
    try {
        const sqlQuery = "SELECT * from erfahrungsbericht";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/islandRating', async function (req, res) {
    try {
        const {island, user, rating} = req.body;
        const sqlQuery = 'INSERT INTO user (insel, user, bewertung) VALUES (?,?,?)';
        const result = await pool.query(sqlQuery, [island, user, rating]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/available-boats', async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM hausbootangebot as Angebot left join (SELECT angebotbewertung.angebot_id, ROUND(AVG(Bewertung),1) AS Durchschnittsbewertung FROM angebotbewertung GROUP BY angebotbewertung.angebot_id ORDER BY Durchschnittsbewertung DESC) AS Bewertung on Angebot.ID = Bewertung.angebot_id";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/user-testimonials', async function (req, res) {
    try {
        const sqlQuery = "SELECT erfahrungsbericht.Text, erfahrungsbericht.bericht_datum, user.Name, user.profilbild FROM erfahrungsbericht INNER JOIN user ON erfahrungsbericht.user_id=user.user_id;";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

router.post('/user-comments', async function (req, res) {
    try {
        const {pointId} = req.body;
        const sqlQuery = "SELECT Kommentar.comment, Kommentar.datum, Kommentar.id, Kommentar.reisepunkt_id, user.Name, user.profilbild  FROM reisepunktkommentar as Kommentar left join user on Kommentar.user_id = user.user_id where Kommentar.reisepunkt_id = ?";
        const rows = await pool.query(sqlQuery, pointId);
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(200).send();
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

module.exports = router;