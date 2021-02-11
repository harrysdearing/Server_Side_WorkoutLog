const Sequelize = require('sequelize');

const sequelize = new Sequelize('WorkoutLog', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection works');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize