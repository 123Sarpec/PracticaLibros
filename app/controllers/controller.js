const db = require('../config/db.config.js');
const Libro = db.Libro;

exports.crear = (req, res) => {
    let libro = {};

    try {
        // Construir objeto Libro desde el cuerpo de la solicitud
        libro.codigolibro = req.body.codigolibro;
        libro.nombre = req.body.nombre;
        libro.editorial = req.body.editorial;
        libro.autor = req.body.autor;
        libro.genero = req.body.genero;
        libro.paisAutor = req.body.paisAutor;
        libro.numeroPaginas = req.body.numeroPaginas;
        libro.añoEdicion = req.body.añoEdicion;
        libro.precioLibro = req.body.precioLibro;
    
        // Guardar en la base de datos MySQL
        Libro.create(libro).then(resultado => {    
            // Enviar mensaje de carga al cliente
            res.status(200).json({
                mensaje: "Libro subido exitosamente con id = " + resultado.id,
                libro: resultado,
            });
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "¡Error!",
            error: error.message
        });
    }
}

exports.obtenerTodosLosLibros = (req, res) => {
    // Encontrar toda la información de los libros
    Libro.findAll()
        .then(infoLibros => {
            res.status(200).json({
                mensaje: "¡Información de todos los libros obtenida exitosamente!",
                libros: infoLibros
            });
        })
        .catch(error => {
            // Log en consola
            console.log(error);

            res.status(500).json({
                mensaje: "¡Error!",
                error: error
            });
        });
}

exports.obtenerLibroPorId = (req, res) => {
    let libroId = req.params.id;
    Libro.findByPk(libroId)
        .then(libro => {
            res.status(200).json({
                mensaje: "¡Libro obtenido exitosamente con id = " + libroId,
                libro: libro
            });
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({
                mensaje: "¡Error!",
                error: error
            });
        });
}

exports.filtrarPorAutor = (req, res) => {
    let autor = req.query.autor;

    Libro.findAll({
                      attributes: ['codigolibro', 'nombre', 'autor', 'editorial', 'genero', 'precioLibro'],
                      where: {autor: autor}
                    })
          .then(resultados => {
            res.status(200).json({
                mensaje: "Obtenidos todos los libros del autor = " + autor,
                libros: resultados,
            });
          })
          .catch(error => {
              console.log(error);
              res.status(500).json({
                mensaje: "¡Error!",
                error: error
              });
          });
}
 
exports.paginacion = (req, res) => {
    try {
        let pagina = parseInt(req.query.pagina);
        let limite = parseInt(req.query.limite);
    
        const offset = pagina ? pagina * limite : 0;
    
        Libro.findAndCountAll({ limit: limite, offset: offset })
            .then(datos => {
                const totalPaginas = Math.ceil(datos.count / limite);
                const respuesta = {
                    mensaje: "¡Paginación completada! Parámetros de consulta: página = " + pagina + ", límite = " + limite,
                    datos: {
                        "totalElementos": datos.count,
                        "totalPaginas": totalPaginas,
                        "limite": limite,
                        "numeroPaginaActual": pagina + 1,
                        "tamañoPaginaActual": datos.rows.length,
                        "libros": datos.rows
                    }
                };
                res.send(respuesta);
            });  
    } catch (error) {
        res.status(500).send({
            mensaje: "¡Error! No se puede completar la solicitud de paginación.",
            error: error.message,
        });
    }    
}

exports.paginacionFiltradoOrdenado = (req, res) => {
    try {
        let pagina = parseInt(req.query.pagina);
        let limite = parseInt(req.query.limite);
        let genero = req.query.genero;
    
        const offset = pagina ? pagina * limite : 0;

        Libro.findAndCountAll({
                                attributes: ['codigolibro', 'nombre', 'autor', 'editorial', 'genero'],
                                where: {genero: genero}, 
                                order: [
                                  ['nombre', 'ASC'],
                                  ['autor', 'DESC']
                                ],
                                limit: limite, 
                                offset: offset 
                              })
            .then(datos => {
                const totalPaginas = Math.ceil(datos.count / limite);
                const respuesta = {
                    mensaje: "Solicitud de Paginación: página = " + pagina + ", límite = " + limite + ", género = " + genero,
                    datos: {
                        "totalElementos": datos.count,
                        "totalPaginas": totalPaginas,
                        "limite": limite,
                        "filtradoPorGenero": genero,
                        "numeroPaginaActual": pagina + 1,
                        "tamañoPaginaActual": datos.rows.length,
                        "libros": datos.rows
                    }
                };
                res.send(respuesta);
            });  
    } catch (error) {
        res.status(500).send({
            mensaje: "¡Error! No se puede completar la solicitud de paginación.",
            error: error.message,
        });
    }      
}

exports.actualizarPorId = async (req, res) => {
    try {
        let libroId = req.params.id;
        let libro = await Libro.findOne({ where: { codigolibro: libroId } });

        if (!libro) {
            res.status(404).json({
                mensaje: "No se encontró el libro con codigolibro = " + libroId,
                libro: "",
                error: "404"
            });
        } else {
            let objetoActualizado = {
                codigolibro: req.body.codigolibro,
                nombre: req.body.nombre,
                editorial: req.body.editorial,
                autor: req.body.autor,
                genero: req.body.genero,
                paisAutor: req.body.paisAutor,
                numeroPaginas: req.body.numeroPaginas,
                añoEdicion: req.body.añoEdicion,
                precioLibro: req.body.precioLibro
            };

            let resultado = await Libro.update(objetoActualizado, {
                returning: true,
                where: { codigolibro: libroId }
            });

            if (resultado[0] === 0) {
                res.status(500).json({
                    mensaje: " No se puede actualizar el libro = " + libroId,
                    error: "No se pudo actualizar",
                });
            } else {
                res.status(200).json({
                    mensaje: "Libro actualizado exitosamente = " + libroId,
                    libro: objetoActualizado,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            mensaje: " No se puede actualizar = " + req.params.id,
            error: error.message
        });
    }
};


exports.eliminarPorId = async (req, res) => {
    try {
        let libroId = req.params.id;
        let libro = await Libro.findByPk(libroId);

        if (!libro) {
            res.status(404).json({
                mensaje: "No existe un libro con id = " + libroId,
                error: "404",
            });
        } else {
            await libro.destroy();
            res.status(200).json({
                mensaje: "Libro eliminado exitosamente con id = " + libroId,
                libro: libro,
            });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: "¡Error! No se puede eliminar el libro con id = " + req.params.id,
            error: error.message,
        });
    }
}
