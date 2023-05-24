import express from 'express';
import cors from 'cors';
// Componentes externas de Librerías
import moment from 'moment';
import Knex from 'knex';
import session from 'express-session';
import passport from 'passport';
import axios from 'axios';

// Control de Autenticación en Usuarios
import { strategyInit } from './lib/AuthStrategy.js';

// Configuración de Conexión con BD
import { development } from './knexfile.js';

// Esquemas de los Modelos
import EmpresaPromotora from './models/Empresa.model.js';
import Cliente from './models/Cliente.model.js';
import Admin from './models/Admin.model.js';
import Evento from './models/Evento.model.js';
import Ventas from './models/Ventas.model.js';

// Instanciamos Express y el middleware de JSON y CORS
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Control de Sesiones de Usuarios
app.use(session({
  secret: 'ocio-session-cookie-key',
  name: 'SessionCookie.SID',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 3000
  }
}))
app.use(passport.initialize());
app.use(passport.session());
strategyInit(passport);

// Conexiones a la base de datos
const dbConnection = Knex(development);
EmpresaPromotora.knex(dbConnection);
Cliente.knex(dbConnection);
Admin.knex(dbConnection);
Evento.knex(dbConnection);
Ventas.knex(dbConnection);

// Endpoint: POST /cinemas --> Devuelve todos los cines
app.post('/cinemas', (req, res) => {
  const consulta = Cinema.query().throwIfNotFound();
  if (!!req.body && req.body !== {}) {
    // Filtrado por ID
    if (!!req.body.id) consulta.findById(req.body.id);

    // Filtrado por fechas
    if (!!req.body.sessionBefore || !!req.body.sessionAfter || !!req.body.withMovie) {
      consulta.withGraphJoined('sessions');
      if (!!req.body.sessionBefore) consulta.where('sessions.day', '<=', req.body.sessionBefore);
      if (!!req.body.sessionAfter) consulta.where('sessions.day', '>=', req.body.sessionAfter);
      if (!!req.body.withMovie) consulta.where('sessions.movie_id', '=', req.body.withMovie)
    }

    // Con cartelera
    if (!!req.body.withCatalog) {
      consulta.withGraphJoined('catalog.sessions').then(async resp => {
        const responseObject = [resp].flat(); // Solución al bug que se desencadena si resp no es un array
        const finalObject = await Promise.all(responseObject.map(async cinema => {
          return {
            ...cinema,
            catalog: await Promise.all(cinema.catalog.map(async movie => {
              return {
                ...movie,
                sessions: await Promise.all(movie.sessions.filter(movie => movie.theater_id === cinema.id).map(async movie => {
                  const timetable = await Timeslot.query().findById(movie.timing_id);
                  return {
                    date: moment(movie.day).format('DD/MM/YYYY'),
                    start: timetable.start_time,
                    end: timetable.end_time
                  }
                }))
              }
            }))
          }
        }));
        res.status(200).json(finalObject);
      }).catch(err => res.status(404).json("error"));
    } else {
      consulta.then(results => res.status(200).json(results)).catch(err => res.status(404).json("error"));
    }
  } else Cinema.query().then(results => res.status(200).json(results));
});

// Endpoint /POST - Inicio Sesión del Administrador
app.post("/loginAdmin", passport.authenticate('local-administrador'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

// Endpoint /POST - Inicio Sesión de Empresas Promotoras
app.post("/loginEmpresa", passport.authenticate('local-empresa'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

// Endpoint /POST - Inicio Sesión de Clientes
app.post("/loginCliente", passport.authenticate('local-cliente'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

// Endpoint /POST - Cerrar Sesión de cualquier tipo de Usuario (Admin, Empresa, Cliente)
app.post("/logout", (req, res) => {
  req.logout(err => {
    if (!!err) res.status(500).json({error: "No se ha podido cerrar sesión."});
    delete req.user; // <-- Elimina el req.user
    req.session.destroy(); // <-- Destruye la sesión
    res.status(200).clearCookie('SessionCookie.SID', {path: "/"}).json({status: "Ok"}); // <-- Borrar la cookie
  })
});
/*
app.post("/registroadmin", (req, res) => {
  const dbQuery = Admin.query();
  if(!!req.user) res.status(400).json({ status: "Sesión Iniciada"});
  else{
    dbQuery.findOne({ email: req.body.email }).then(async result => {
      if (!!result) {
        res.status(500).json({ error: "El administrador ya está registrado" });
      } else {
        dbQuery.insert({
          email: req.body.email,
          unsecurePassword: String(req.body.password),
        }).then(insertResult => {
          if (!!insertResult) {
            res.status(200).json({ status: "OK" });
          } else {
            res.status(500).json({ status: "Error al registrar la empresa" });
          }
        }).catch(error => {
          res.status(500).json({ status: "Error al registrar la empresa" });
        });    
      }
    });
  }
});
*/

app.post("/registroempresa", (req, res) => {
  const dbQuery = EmpresaPromotora.query();
  if(!!req.user) res.status(400).json({ status: "Sesión Iniciada"});

  else{
    dbQuery.findOne({ email: req.body.email }).then(async result => {
      if (!!result) {
        res.status(500).json({ error: "La empresa ya está registrada" });
      } else {
        dbQuery.insert({
          nombre_empresa: req.body.nombre_empresa,
          email: req.body.email,
          unsecurePassword: String(req.body.password),
          cif: req.body.cif,
          domicilio_social: req.body.domicilio_social,
          telefono: req.body.telefono,
          persona_responsable: req.body.persona_responsable,
          capital_social: req.body.capital_social,
          verificada: false
        }).then(insertResult => {
          if (!!insertResult) {
            res.status(200).json({ status: "OK" });
          } else {
            res.status(500).json({ status: "Error al registrar la empresa" });
          }
        }).catch(error => {
          res.status(500).json({ status: "Error al registrar la empresa" });
        });
      }
    });
  }
});

app.post("/registrocliente", (req, res) => {
  const dbQuery = Cliente.query();
  dbQuery.findOne({ email: req.body.email }).then(async result => {
    if (!!result) {
      return res.status(500).json({ error: "El cliente ya está registrado" });
    }

    const fechaNacimiento = req.body.fechanacimiento;
    const isValidDate = moment(fechaNacimiento, 'YYYY-MM-DD', true).isValid();

    if (!isValidDate) {
      return res.status(400).json({ error: "Fecha de nacimiento inválida" });
    }

    const edadMinima = 18;
    const fechaActual = moment();
    const edad = fechaActual.diff(fechaNacimiento, 'years');

    if (edad < edadMinima) {
      return res.status(400).json({ error: "Debes ser mayor de 18 años para registrarte" });
    }

    dbQuery
      .insert({
        email: req.body.email,
        unsecurePassword: String(req.body.password),
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        dni: req.body.dni,
        telefono: req.body.telefono,
        fechanacimiento: req.body.fechanacimiento,
      })
      .then(insertResult => {
        if (!!insertResult) {
          return res.status(200).json({ status: "OK" });
        } else {
          return res.status(500).json({ status: "Error al registrar el cliente" });
        }
      })
      .catch(error => {
        return res.status(500).json({ status: "Error al registrar el cliente" });
      });
  });
});


app.post("/registroeventos", (req, res) => {
  const dbQuery = Evento.query();
  dbQuery.findOne({ nombre: req.body.nombre }).then(async result => {
    if (!!result) {
      return res.status(500).json({ error: "El evento ya está registrado" });
    }

    const fechaEvento = moment(req.body.fecha, 'YYYY-MM-DD', true);
    const horaEvento = moment(req.body.hora, 'HH:mm', true);

    if (!fechaEvento.isValid() || !horaEvento.isValid()) {
      return res.status(400).json({ error: "Fecha u hora de evento inválida" });
    }

    const fechaActual = moment();
    const horaActual = moment();
    const tiempoEvento = moment(fechaEvento).set({ 'hour': horaEvento.hours(), 'minute': horaEvento.minutes() });
    const tiempoActual = moment(fechaActual).set({ 'hour': horaActual.hours(), 'minute': horaActual.minutes() });
    const valido = (tiempoEvento - tiempoActual) / (1000 * 60 * 60);

    if (valido < 24) {
      return res.status(400).json({ error: "Quedan menos de 24 horas hasta el evento, no se puede registrar" });
    }

    EmpresaPromotora.query()
      .findById(req.body.empresa_promotora_id)
      .then(async empresa => {
        if (!empresa) {
          return res.status(400).json({ error: "La empresa promotora no existe" });
        }

        dbQuery
          .insert({
            nombre: req.body.nombre,
            artista: req.body.artista,
            ubicacion: req.body.ubicacion,
            aforo: req.body.aforo,
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            hora: req.body.hora,
            precio_entrada: req.body.precio_entrada,
            empresa_promotora_id: req.body.empresa_promotora_id
          })
          .then(insertResult => {
            if (!!insertResult) {
              res.status(200).json({ status: "OK" });
            } else {
              res.status(500).json({ status: "Error al registrar el evento" });
            }
          })
          .catch(error => {
            res.status(500).json({ status: "Error al registrar el evento" });
          });
      })
      .catch(error => {
        res.status(500).json({ status: "Error al buscar la empresa promotora" });
      });
  });
});



app.post("/verificarempresa", async (req, res) => {
  try {
    const empresa = await EmpresaPromotora.query().findOne({ id: req.body.id });
    if (!empresa) {
      res.status(404).json({ error: "La empresa no existe" });
    } else {
      await EmpresaPromotora.query().patch({ verificada: true }).where({ id: req.body.id });
      res.status(200).json({ status: "OK" });
    }
  } catch (error) {
    res.status(500).json({ status: "Error al verificar la empresa" });
  }
});

app.post('/mostrarempresas', (req, res) => {
  const consulta = EmpresaPromotora.query();

  if (!!req.body && req.body !== {}) {
    // Filtrado por verificadas para admin
    if (req.body.verificada !== undefined) {
      consulta.where('verificada', req.body.verificada);
    }
  }

  consulta
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json({ error: 'Error al obtener las empresas' }));
});



app.post('/mostrarevento', (req, res) => {
  const consulta = Evento.query().throwIfNotFound();

  //esto me lo hace el front lo de ordenar

  if (!!req.body && req.body !== {}) {
    // Filtrado id para clientes
    if (!!req.body.id) consulta.findById(req.body.id);

    // Filtrado fecha para clientes
    if (!!req.body.fecha) consulta.where('fecha', '=', req.body.fecha);

    // Filtrado artista para clientes
    if (!!req.body.artista) consulta.where('artista', '=', req.body.artista);

    // Filtrado para empresas
    if (!!req.body.empresa_promotora_id) consulta.where('empresa_promotora_id', '=', req.body.empresa_promotora_id);
  
  } else Evento.query().then(results => res.status(200).json(results));

  // Ordenar por ID, fecha o artista
  if (req.body.order === 'id') {
    consulta.orderBy('id');
  } else if (req.body.order === 'fecha') {
    consulta.orderBy('fecha');
  } else if (req.body.order === 'artista') {
    consulta.orderBy('artista');
  }

  consulta.then(results => res.status(200).json(results)).catch(err => res.status(500).json({ error: 'Error al obtener los eventos' }));
});

// NECESITO QUE ME CAMBIES EL ID POR EL EMAIL, QUE ES LA INFORMACIÓN QUE TENGO DEL USUARIO APARTE DE SU TIPO
app.delete("/eliminarcliente", (req, res) => {
  const dbQuery = Cliente.query();
  const clienteId = req.body.id;

  dbQuery
    .findById(clienteId)
    .then(cliente => {
      if (!cliente) {
        res.status(404).json({ error: "El cliente no existe" });
      } else {
        dbQuery
          .deleteById(clienteId)
          .then(contador => {
            if (contador > 0) {
              res.status(200).json({ status: "OK" });
            } else {
              res.status(500).json({ error: "Error al eliminar el cliente" });
            }
          })
          .catch(error => {
            res.status(500).json({ error: "Error al eliminar el cliente" });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Error al buscar el cliente" });
    });
});

// LO MISMO QUE CLIENTE
app.delete("/eliminarempresa", (req, res) => {
  const dbQuery = EmpresaPromotora.query();
  const empresaId = req.body.id;

  dbQuery
    .findById(empresaId)
    .then(empresa => {
      if (!empresa) {
        res.status(404).json({ error: "La empresa no existe" });
      } else {
        dbQuery
          .deleteById(empresaId)
          .then(contador => {
            if (contador > 0) {
              res.status(200).json({ status: "OK" });
            } else {
              res.status(500).json({ error: "Error al eliminar la empresa" });
            }
          })
          .catch(error => {
            res.status(500).json({ error: "Error al eliminar la empresa" });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Error al buscar la empresa" });
    });
});


app.delete("/eliminarevento", (req, res) => {
  const dbQuery = Evento.query();
  const eventoId = req.body.id;

  dbQuery
    .findById(eventoId)
    .then(evento => {
      if (!evento) {
        res.status(404).json({ error: "El evento no existe" });
      } else {
        const fechaEvento = moment(evento.fecha, 'YYYY-MM-DD');
        const horaEvento = moment(evento.hora, 'HH:mm');
        const fechaActual = moment();
        const horaActual = moment();
        const tiempoEvento = moment(fechaEvento).set({ 'hour': horaEvento.hours(), 'minute': horaEvento.minutes() });
        const tiempoActual = moment(fechaActual).set({ 'hour': horaActual.hours(), 'minute': horaActual.minutes() });
        const valido = (tiempoEvento - tiempoActual) / (1000 * 60 * 60);

        if (valido > 24) {
          dbQuery
            .deleteById(eventoId)
            .then(contador => {
              if (contador > 0) {
                res.status(200).json({ status: "OK" });
              } else {
                res.status(500).json({ error: "Error al eliminar el evento" });
              }
            })
            .catch(error => {
              res.status(500).json({ error: "Error al eliminar el evento" });
            });
        } else {
          res.status(400).json({ error: "Quedan menos de 24H hasta el evento, no puede ser eliminado" });
        }
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Error al buscar el evento" });
    });
});

app.put("/modificarevento", (req, res) => {
  const dbQuery = Evento.query();
  const eventoId = req.body.id;
  const nombremod = req.body.nombre;
  const artistamod = req.body.artista;
  const ubicacionmod = req.body.ubicacion;
  const descripcionmod = req.body.descripcion;
  const aforomod = req.body.aforo;
  const fechamod = req.body.fecha;
  const horamod = req.body.hora;
  const preciomod = req.body.precio_entrada;

  dbQuery
    .findById(eventoId)
    .then(evento => {
      if (!evento) {
        res.status(404).json({ error: "El evento no existe" });
      } else {
        const fechaEvento = moment(fechamod, 'YYYY-MM-DD');
        const horaEvento = moment(horamod, 'HH:mm');
        const fechaActual = moment();
        const horaActual = moment();
        const tiempoEvento = moment(fechaEvento).set({ 'hour': horaEvento.hours(), 'minute': horaEvento.minutes() });
        const tiempoActual = moment(fechaActual).set({ 'hour': horaActual.hours(), 'minute': horaActual.minutes() });
        const valido = (tiempoEvento - tiempoActual) / (1000 * 60 * 60);

        if (valido > 24) {
          evento
            .$query()
            .patch({ 
              nombre: nombremod,
              artista: artistamod,
              ubicacion: ubicacionmod ,
              aforo: aforomod, 
              descripcion: descripcionmod, 
              fecha: fechamod, 
              hora: horamod, 
              precio_entrada: preciomod,
            })
            .then(() => {
              res.status(200).json({ status: "OK" });
            })
            .catch(error => {
              res.status(500).json({ error: "Error al modificar la información del evento" });
            });
        } else {
          res.status(400).json({ error: "Quedan menos de 24 horas hasta el evento, no se puede modificar" });
        }
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Error al buscar el evento" });
    });
});


app.post("/pago", async (req, res) => {
  const cardDetails = {
    tarjeta: req.body.tarjeta_credito,
    cvv: req.body.cvv,
    f_caducidad: req.body.fecha_caducidad,
    cantidad: req.body.cantidad
  };


  axios({
    url: 'https://pse-payments-api.ecodium.dev/payment',
    method: 'POST',
    data: {
      clientId: 3,
      paymentDetails: {
        creditCard: {
          cardNumber: cardDetails.tarjeta,
          cvv: cardDetails.cvv,
          expiresOn: "06/2027"
        },
        totalAmount: 50,
      }
    }
  }).then(response => {
    const id = response.data._id;
    const dbQuery = Ventas.query().insert({
      id,
      evento_id: req.body.evento_id,
      cliente_id: req.body.cliente_id,
      cantidad: req.body.cantidad,
      fecha_compra: req.body.fecha_compra,
      num_entradas: req.body.num_entradas
    }).then(dbRes => {
      res.status(200).json({ status: 'OK' });
    }).catch(dbErr => {
      res.status(500).json({ status: 'Error en la inserción en la base de datos' });
    });
  }).catch(paymentErr => {
    res.status(500).json({ status: 'Error en la solicitud de pago' });
  });
});



app.get("/user", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session.passport.user) : res.status(401).send('Sesión no iniciada!'));



// Definimos el puerto 8000 como puerto de escucha y un mensaje de confirmación cuando el servidor esté levantado
app.listen(8000, () => {
  console.log(`Servidor escuchando en el puerto 8000`);
});

