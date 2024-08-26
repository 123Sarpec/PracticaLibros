const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./app/config/db.config.js');

// Sincronización de la base de datos (crea las tablas si no existen)
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
});

const router = require('./app/routers/router.js');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/', router);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de Libros" });
});

// Crear un servidor
const server = app.listen(8080, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
