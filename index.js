const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

// Routes
const employees = require('./Routes/employees');
const users = require('./Routes/users');
const asistencias = require('./Routes/asistencias');
const nominas = require('./Routes/nominas');

// Middleware
const auth = require('./middleware/auth');
const notFound = require('./middleware/notfound');
const cors = require('./middleware/cors');

app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'Panel')));

// Página principal
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// 👇 Rutas PUBLICAS (login y register)
app.use('/users', users); 

// 👇 Middleware que protege RUTAS PRIVADAS
app.use(auth);

// 👇 Rutas PROTEGIDAS
app.use('/employees', employees);
app.use('/asistencias', asistencias);
app.use('/nominas', nominas);

app.use(notFound);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
