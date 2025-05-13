const express = require('express');
const {sequelize} = require("./db");
const session = require('express-session');
const app = express();

const methodOverride = require('method-override');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';


app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./public'));
app.use(methodOverride('_method'));

app.use(cors({
    origin: '*',
}))


app.use(express.json());

app.use('/api/branches', require('./src/routes/branchesAPI'));
app.use('/api/employees', require('./src/routes/employeesAPI'));
app.use('/api/positions', require('./src/routes/positions'));


app.use('/', require('./src/routes/index'));
app.use('/certificate', require('./src/routes/certificate'));
app.use('/settings', require('./src/routes/settings'));
app.use('/employees', require('./src/routes/employees'));
const server = app.listen(PORT, HOST, () => {
    try {
        sequelize.authenticate().then(() => {
            console.log('Подключено к базе данных');
        })
            .catch(err => {
                console.error('Ошибка подключения к базе данных:', err);
            });
        console.log(`Работает на адресе ${HOST}:${PORT}`);
    }
    catch (err){
        console.error(err);
    }
})
