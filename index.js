require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./database');
const user = require('./controllers/usercontroller');
const log = require('./controllers/logcontroller');

sequelize.sync();

app.use(express.json());
app.use(require('./middleware/headers'));
app.use('/user', user);
app.use('/log', log);

app.listen(3000, function() {
    console.log('App is listening on port 3000');
});