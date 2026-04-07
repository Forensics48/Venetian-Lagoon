const express = require('express');
const pool = require('../helpers/database');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { end } = require('../helpers/database');
const res = require('express/lib/response');
router.use(cookieParser());

const maxAge = 3 * 24 * 60 * 60;

const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = "Die Email existiert nicht";
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Falsches Kennwort';
    }

    if (err.message === 'invalid password') {
        errors.password = 'Ungültiges Passwort-Format'
    }

    if (err.message === 'invalid email') {
        errors.email = "Ungültiges E-Mail-Format";
    }

    // duplicate email error
    if (err.errno === 1062) {
        errors.email = 'E-Mail ist bereits vorhanden';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        // console.log(err);
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(val);
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const checkUser = (req, res, next) => {
    if (req.cookies === undefined) {
        res.locals.user = null;
        next();
    }
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                res.locals.user = decodedToken.id;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

router.post('/signup', async function (req, res) {
    try {
        const { name, email, password, vendor } = req.body;

        if (!isValidEmail(email)) {
            throw Error('invalid email');
        }

        if (!isValidPassword(password)) {
            throw Error('invalid password');
        }

        let isVendor = false;
        if (vendor === 'true') {
            isVendor = 1;
        } else {
            isVendor = 0;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const sqlQuery = 'INSERT INTO user (name, email, passwort, anbieter, profilbild) VALUES (?,?,?,?, "default.jpg")';
        const result = await pool.query(sqlQuery, [name, email, encryptedPassword, isVendor]);
        let isValid = false;
        if (result.affectedRows >= 1) {
            isValid = true;
            const token = createToken(email);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ successful: isValid });
        } else {
            console.log(result);
        }
    } catch (err) {
        const error = handleErrors(err);
        console.log(err.message);
        res.status(400).send(error);
    }
});

router.post('/login', async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!isValidEmail(email)) {
            throw Error('invalid email');
        }

        const sqlGetUser = 'SELECT passwort FROM user WHERE email=?';
        const rows = await pool.query(sqlGetUser, email);

        if (rows[0]) {
            const isValid = await bcrypt.compare(password, rows[0].passwort);
            if (isValid) {
                const token = createToken(email);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(200).json({ successful: isValid });
            } else {
                throw Error('incorrect password');
            }
            return;
        }
        throw Error('incorrect email');
    } catch (err) {
        const error = handleErrors(err);
        res.status(400).send(error);
    }
});

router.post('/deleteAccount', checkUser, async function (req, res) {
    try {
        if (res.locals.user != null) {
            const email = res.locals.user;
            if (!isValidEmail(email)) {
                throw Error('invalid email');
            }
            const sqlGetUser = 'DELETE FROM user WHERE email=?';
            const rows = await pool.query(sqlGetUser, email);

            if (rows.affectedRows > 0) {
                res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
                res.status(200).send("Account Deleted");
            } else {
                res.status(400).send("Couldn't find an account with that email");
            }
        } else {
            res.status(400).send("Not Logged in");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/currentUser', checkUser, async function (req, res) {
    let user = {};
    let userEmail = res.locals.user;
    user.email = userEmail;

    const sqlGetUserName = 'SELECT name, user_id, anbieter, profilbild FROM user WHERE email=?';
    const rows = await pool.query(sqlGetUserName, userEmail);

    if (rows[0]) {
        user.name = rows[0].name;
        user.id = rows[0].user_id;
        user.pfp = rows[0].profilbild;
        user.isVendor = rows[0].anbieter;
    }

    if (res.locals.user) {
        res.status(200).json({ user });
    } else {
        res.status(200).json({ user: "notLoggedIn" });
    }
});

router.get('/isLoggedIn', checkUser, async function (req, res) {
    let loggedIn = false;
    if (res.locals.user) {
        loggedIn = true;
    }
    res.status(200).json({ loggedIn });
});

router.get('/logout', async function (req, res) {
    try {
        res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
        res.status(200).send("Logged out");
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

router.post('/updatePassword', async function (req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body;
        var sqlQuery = 'SELECT passwort FROM user WHERE email=?';
        var rows = await pool.query(sqlQuery, email);

        if (rows[0]) {
            const isValid = await bcrypt.compare(oldPassword, rows[0].passwort);
            if (isValid) {
                sqlQuery = 'UPDATE user SET passwort=? WHERE email=?';
                const encryptedPassword = await bcrypt.hash(newPassword, 10);
                var result = await pool.query(sqlQuery, [encryptedPassword, email]);
                if (result.affectedRows >= 1) {
                    res.status(200).send("Password updated");
                }
            } else {
                res.status(400).send("Wrong password");
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/updateProfilePic', checkUser, async function (req, res) {
    try {
        const { pfpName, userId } = req.body;
        var sqlQuery = 'UPDATE user SET profilbild=? WHERE user_id=?';
        var result = await pool.query(sqlQuery, [pfpName, userId]);
        if (result.affectedRows >= 1) {
            res.status(200).send("Password updated");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/userLogbooks', checkUser, async function (req, res) {
    try {
        const { userId } = req.body;
        const sqlGetUserLogbooks = 'SELECT * FROM logbucheintrag WHERE UserID=?';
        const rows = await pool.query(sqlGetUserLogbooks, userId);
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(200).send();
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/addLogbook', async function (req, res) {
    try {
        const { user, date, locationMorning, locationEvening } = req.body;
        const sqlQuery = 'INSERT INTO logbucheintrag (UserID, Datum, StandortMorgens, StandortAbends) VALUES (?,?,?,?)';
        const result = await pool.query(sqlQuery, [user, date, locationMorning, locationEvening]);
        if (result.affectedRows >= 1) {
            res.status(200).send();
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/userBookings', checkUser, async function (req, res) {
    try {
        const { userId } = req.body;
        const sqlQuery = "SELECT hausbootangebot.Name, hausbootangebot.Mietpreis, reise.StartDatum, reise.EndDatum, reise.boatangebot_id FROM hausbootangebot INNER JOIN reise ON hausbootangebot.ID=reise.boatangebot_id WHERE reise.user_id=?;";
        const rows = await pool.query(sqlQuery, userId);
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

router.post('/userOffers', checkUser, async function (req, res) {
    try {
        const { userId } = req.body;
        const sqlQuery = "SELECT * FROM hausbootangebot as Angebot left join (SELECT angebotbewertung.angebot_id, ROUND(AVG(Bewertung),1) AS Durchschnittsbewertung FROM angebotbewertung GROUP BY angebotbewertung.angebot_id ORDER BY Durchschnittsbewertung DESC) AS Bewertung on Angebot.ID = Bewertung.angebot_id where Angebot.anbieter_id = ?";
        const rows = await pool.query(sqlQuery, userId);
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

router.post('/bookBoat', checkUser, async function (req, res) {
    try {
        const { startDate, endDate, userId, vendorId, boatOfferId } = req.body;
        const sqlQuery = 'INSERT INTO reise (StartDatum, EndDatum, user_id, anbieter_id, boatangebot_id) VALUES (?,?,?,?,?)';
        const result = await pool.query(sqlQuery, [startDate, endDate, userId, vendorId, boatOfferId]);
        if (result.affectedRows >= 1) {
            res.status(200).send("Successfully booked.");
        } else {
            console.log(result);
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/addTestimonial', checkUser, async function (req, res) {
    try {
        const { text, userId } = req.body;
        const currDate = new Date().toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit' });

        const sqlQuery = 'INSERT INTO erfahrungsbericht (Text, user_id, bericht_datum) VALUES (?,?,?)';
        const result = await pool.query(sqlQuery, [text, userId, currDate]);
        if (result.affectedRows >= 1) {
            res.status(200).send("Successfully added testimonial.");
        } else {
            console.log(result);
            res.status(400).send();
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/addIslandRating', checkUser, async function (req, res) {
    try {
        const { islandName, userId, islandRating } = req.body;
        let sqlQuery = 'SELECT * FROM inselbewertung WHERE user_id = ? and Insel = ?';
        let result = await pool.query(sqlQuery, [userId, islandName]);
        if (result.length >= 1) {
            sqlQuery = 'UPDATE inselbewertung SET Bewertung = ? WHERE user_id = ? and Insel = ?';
            result = await pool.query(sqlQuery, [islandRating, userId, islandName]);
            if (result.affectedRows >= 1) {
                res.status(200).send("Successfully added rating.");
            }
        } else {
            sqlQuery = 'INSERT INTO inselbewertung (Insel, Bewertung, user_id) VALUES (?,?,?)';
            result = await pool.query(sqlQuery, [islandName, islandRating, userId]);
            if (result.affectedRows >= 1) {
                res.status(200).send("Successfully added rating.");
            }
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

router.post('/addOfferRating', checkUser, async function (req, res) {
    try {
        const { offerId, userId, offerRating } = req.body;
        let sqlQuery = 'SELECT * FROM angebotbewertung WHERE user_id = ? and angebot_id = ?';
        let result = await pool.query(sqlQuery, [userId, offerId]);
        if (result.length >= 1) {
            sqlQuery = 'UPDATE angebotbewertung SET Bewertung = ? WHERE user_id = ? and angebot_id = ?';
            result = await pool.query(sqlQuery, [offerRating, userId, offerId]);
            if (result.affectedRows >= 1) {
                res.status(200).send("Successfully added rating.");
            }
        } else {
            sqlQuery = 'INSERT INTO angebotbewertung (user_id, angebot_id, Bewertung) VALUES (?,?,?)';
            result = await pool.query(sqlQuery, [userId, offerId, offerRating]);
            if (result.affectedRows >= 1) {
                res.status(200).send("Successfully added rating.");
            }
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

router.post('/addComment', checkUser, async function (req, res) {
    try {
        const { pointId, userId, comment } = req.body;
        const currDate = new Date().toLocaleString('de', { year: 'numeric', month: '2-digit', day: '2-digit' });

        let sqlQuery = 'INSERT INTO reisepunktkommentar (comment, user_id, reisepunkt_id, datum) VALUES (?,?,?,?)';
        let result = await pool.query(sqlQuery, [comment, userId, pointId, currDate]);
        if (result.affectedRows >= 1) {
            res.status(200).send("Successfully added comment.");
        }
        
    } catch (err) {
        console.log(err.message);
        res.status(400).send(err.message);
    }
});

const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

function isValidEmail(email) {
    if (!email.includes('@')) {
        return false;
    }
    if (!email.includes('.')) {
        return false;
    }
    return email.length >= 4;
}

function isValidPassword(password) {
    if (password.length < 6) {
        return false;
    }
    if (password.includes(' ')) {
        return false;
    }
    return password.length <= 20;
}

module.exports = router;