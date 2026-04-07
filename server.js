const express = require('express');
const dotenv = require('dotenv');
const { requireAuth, checkUser } = require('./middleware/authMiddleware.js');

dotenv.config({path: '.env-local'});
const PORT = process.env.PORT || '3000';


const app = express();

/**
 * Middleware
 */

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
});

const userRouter = require('./routes/user');
const dataRouter = require('./routes/data');
const uploadsRouter = require('./routes/uploads');
const offersRouter = require('./routes/offers');

app.use('/user', userRouter);
app.use('/data', dataRouter);
app.use('/uploads', uploadsRouter);
app.use('/offers', offersRouter);

app.get('*', (req, res) => {
    res.sendFile('/public/404.html', { root: '.' })
});