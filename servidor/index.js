import express from 'express';
import cors from 'cors';
import moment from 'moment';
import Knex from 'knex';
import session from 'express-session';
import passport from 'passport';
import axios from 'axios';


import { strategyInit } from './lib/AuthStrategy.js';
import { development } from './knexfile.js';

import ShowTiming from './models/ShowTiming.model.js';
import Timeslot from './models/Timeslot.model.js';
import Sales from './models/Sales.model.js';
import EmpresaPromotora from './models/Empresa.model.js';
import Cliente from './models/Cliente.model.js';
import Admin from './models/Admin.model.js';
import Evento from './models/Evento.model.js';

// Instanciamos Express y el middleware de JSON y CORS
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

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

// Endpoint: POST /movies --> Devuelve todas las películas
app.post('/movies', (req, res) => {
  const consulta = Movie.query().throwIfNotFound();
  if (!!req.body && req.body !== {}) {

    // Filtrado por ID
    if (!!req.body.id) consulta.findById(req.body.id);

    // Filtrado por fechas
    if (!!req.body.sessionBefore || !!req.body.sessionAfter) {
      consulta.withGraphJoined('sessions');
      if (!!req.body.sessionBefore) consulta.where('sessions.day', '<=', req.body.sessionBefore);
      if (!!req.body.sessionAfter) consulta.where('sessions.day', '>=', req.body.sessionAfter);
    }

    consulta.then(async results => {
      const finalObject = !!req.body.actors
        // Filtrado por reparto
        ? results.filter(elem => {
          const actorsArray = elem.actors.split(',');
          return actorsArray.every(actor => req.body.actors.includes(actor))
        })
        : results;
      if (!!req.body.sessionBefore || !!req.body.sessionAfter) {
        // Formateo de cartelera
        const formattedObject = await Promise.all(finalObject.map(async elem => {
          return {
            ...elem,
            sessions: await Promise.all(elem.sessions.map(async session => {
              const theaterInfo = await Cinema.query().findById(session.theater_id);
              const timingInfo = await Timeslot.query().findById(session.timing_id);
              return {
                cinema: theaterInfo.name,
                day: moment(session.day).format('DD/MM/YYYY'),
                start: timingInfo.start_time,
                end: timingInfo.end_time,
              }
            }))
          }
        }));
        res.status(200).json(formattedObject);
      } else res.status(200).json(finalObject);


    })
  } else Movie.query().then(results => res.status(200).json(results));


});

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

app.post("/loginAdmin", passport.authenticate('local-administrador'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post("/loginEmpresa", passport.authenticate('local-empresa'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post("/loginCliente", passport.authenticate('local-cliente'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' })
  }
  else res.status(500).json({ status: "Sesión no iniciada" });
});

app.post("/logoutAdmin", (req, res) => {
  req.logout(() => {});
  res.status(200).json({ status: "OK" });
});

app.post("/logoutEmpresa", (req, res) => {
  req.logout(() => {});
  res.status(200).json({ status: "OK" });
});

app.post("/logoutCliente", (req, res) => {
  req.logout(() => {});
  res.status(200).json({ status: "OK" });
});

app.post("/registroadmin", (req, res) => {
  const dbQuery = Admin.query();
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
});

app.post("/registroempresa", (req, res) => {
  const dbQuery = EmpresaPromotora.query();
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
});

app.post("/registrocliente", (req, res) => {
  const dbQuery = Cliente.query();
  dbQuery.findOne({ email: req.body.email }).then(async result => {
    if (!!result) res.status(500).json({ error: "El cliente ya está registrado" });
    else {
      const fechaNacimiento = req.body.fechanacimiento;
      const isValidDate = moment(fechaNacimiento, 'YYYY-MM-DD', true).isValid();
      if (!isValidDate) {
        res.status(400).json({ error: "Fecha de nacimiento inválida" });
        return;
      }
      const edadMinima = 18;
      const fechaActual = moment();
      const edad = fechaActual.diff(fechaNacimiento, 'years');    
      if (edad < edadMinima) {
        res.status(400).json({ error: "Debes ser mayor de 18 años para registrarte" });
        return;
      }
      dbQuery.insert({
        email: req.body.email,
        unsecurePassword: String(req.body.password),
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        dni: req.body.dni,
        telefono: req.body.telefono,
        fechanacimiento: req.body.fechanacimiento,
      }).then(insertResult => {
        if (!!insertResult) res.status(200).json({ status: "OK" });
        else res.status(500).json({ status: "Error al registrar el cliente" });
      }).catch(error => {
        res.status(500).json({ status: "Error al registrar el clientes" });
      })
    }
  })
});

app.post("/registroeventos", (req, res) => {
  const dbQuery = Evento.query();
  dbQuery.findOne({ nombre: req.body.nombre }).then(async result => {
    if (!!result) {
      res.status(500).json({ error: "El evento ya está registrado" });
    } else {
      const fechaEvento = req.body.fecha;
      const isValidDate = moment(fechaEvento, 'YYYY-MM-DD', true).isValid();
      if (!isValidDate) {
        res.status(400).json({ error: "Fecha de evento inválida" });
        return;
      }

      EmpresaPromotora.query()
        .findById(req.body.empresa_promotora_id)
        .then(async empresa => {
          if (!empresa) {
            res.status(400).json({ error: "La empresa promotora no existe" });
            return;
          }

          dbQuery
            .insert({
              nombre: req.body.nombre,
              artista: req.body.artista,
              ubicacion: req.body.ubicacion,
              aforo: req.body.aforo,
              descripcion: req.body.descripcion,
              fecha: req.body.fecha,
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
    }
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
  const consulta = EmpresaPromotora.query().throwIfNotFound();

  if (!!req.body && req.body !== {}) {
    // Filtrado por verificadas para admin
    if (req.body.verificada !== undefined) {
      const verificadas = req.body.verificada === 'true'; 
      consulta.where('verificada', '=', verificadas);
    }
  }

  consulta
    .then(results => res.status(200).json(results))
    .catch(err => res.status(500).json({ error: 'Error al obtener las empresas' }));
});


app.post('/mostrarevento', (req, res) => {
  const consulta = Evento.query().throwIfNotFound();

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
        const fechaEvento = new Date(evento.fecha);
        const fechaActual = new Date();
        const valido = (fechaEvento - fechaActual) / (1000 * 60 * 60);

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
  const descripcionmod = req.body.descripcion;

  dbQuery
    .findById(eventoId)
    .then(evento => {
      if (!evento) {
        res.status(404).json({ error: "El evento no existe" });
      } else {
        const fechaEvento = new Date(evento.fecha);
        const fechaActual = new Date();
        const valido = (fechaEvento - fechaActual) / (1000 * 60 * 60);

        if (valido > 24) {
          evento
            .$query()
            .patch({ descripcion: descripcionmod })
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
    tarjeta: req.body.tarjeta,
    cvv: req.body.cvv,
    importe: req.body.importe
  };

  axios({
    url: 'https://pse-payments-api.ecodium.dev/payment',
    method: 'POST',
    data: {
      clientId: 3,
      paymentDetails: {
        creditCard: {
          cardNumber: "11112222333334444",
          cvv: 17,
          expiresOn: "06/2027"
        },
        totalAmount: 35.89,
      }
    }
  }).then(response => {
    const id = response.data._id;
    const dbQuery = Sales.query().insert({
      id,
      amount: String(req.body.amount),
      client: 'test',
      event: 'test2',
    }).then(dbRes => {
      res.status(200).json({ status: 'Pago realizado correctamente' });
      //debugger;
    }).catch(dbErr => {
      res.status(500).json({ status: 'Error en la inserción en la base de datos' });
      //debugger;
    });
  }).catch(paymentErr => {
    res.status(500).json({ status: 'Error en la solicitud de pago' });
    //debugger;
  });
});



app.get("/user", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session) : res.status(401).send('Sesión no iniciada!'));



// Definimos el puerto 8000 como puerto de escucha y un mensaje de confirmación cuando el servidor esté levantado
app.listen(8000, () => {
  console.log(`Servidor escuchando en el puerto 8000`);
});

