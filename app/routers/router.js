let express = require('express');
let router = express.Router();

const libros = require('../controllers/controller.js');

router.post('/api/libros/create', libros.crear);
router.get('/api/libros/all', libros.obtenerTodosLosLibros);
router.get('/api/libros/onebyid/:id', libros.obtenerLibroPorId);
router.put('/api/libros/update/:id', libros.actualizarPorId);
router.delete('/api/libros/delete/:id', libros.eliminarPorId);

module.exports = router;
