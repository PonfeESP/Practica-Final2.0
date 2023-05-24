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

// Endpoint /POST - Inicio Sesión del Administrador
/*app.post("/loginAdmin", passport.authenticate('local-administrador'), (req, res) => {
  if (!!req.user) {
    res.status(200).json({ status: 'OK' });
  } else if (req.authInfo && req.authInfo.error === 'Administrador desconocido') {
    res.status(401).json({ error: 'Administrador desconocido' });
  } else {
    res.status(500).json({ error: 'Sesión no iniciada' });
  }
});
*/

app.post("/loginAdmin", (req, res, next) => {
  passport.authenticate('local-administrador', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Acceso denegado' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error del servidor' });
      }
      return res.status(200).json({ status: 'OK' });
    });
  })(req, res, next);
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
    if (!!err) res.status(500).json({ error: "No se ha podido cerrar sesión." });
    delete req.user; // <-- Elimina el req.user
    req.session.destroy(); // <-- Destruye la sesión
    res.status(200).clearCookie('SessionCookie.SID', { path: "/" }).json({ status: "Ok" }); // <-- Borrar la cookie
  })
});

async function comprobarEmail(email) {
  const varCliente = Cliente.query();
  const varAdmin = Admin.query();
  const varEmpresa = EmpresaPromotora.query();

  const cliente = await varCliente.findOne({ email });
  const admin = await varAdmin.findOne({ email });
  const empresa = await varEmpresa.findOne({ email });

  return { cliente, admin, empresa };
}


app.post("/registroadmin", async (req, res) => {
  const dbQuery = Admin.query();
  if (!!req.user) {
    return res.status(400).json({ status: "Sesión Iniciada" });
  } else {
    try {
      const resultado = await comprobarEmail(req.body.email);
      if (resultado.cliente || resultado.admin || resultado.empresa) {
        return res.status(500).json({ error: "Este email ya esta registrado" });
      } else {
        dbQuery.insert({
          email: req.body.email,
          unsecurePassword: String(req.body.password),
        })
        .then(insertResultadp => {
          if (!!insertResultadp) {
            return res.status(200).json({ status: "OK" });
          } else {
            return res.status(500).json({ status: "Error al registrar el administrador" });
          }
        })
        .catch(error => {
          return res.status(500).json({ status: "Error al registrar el administrador" });
        });
      }
    } catch (error) {
      return res.status(500).json({ status: "Error al registrar el administrador" });
    }
    
  }
});




app.post("/registroempresa", async (req, res) => {
  const dbQuery = EmpresaPromotora.query();
  if (!!req.user) {
    return res.status(400).json({ status: "Sesión Iniciada" });
  } else {
    try {
      const resultado = await comprobarEmail(req.body.email);
      if (resultado.cliente || resultado.admin || resultado.empresa) {
        return res.status(500).json({ error: "Este email ya esta registrado" });
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
        })
          .then(insertResult => {
            if (!!insertResult) {
              return res.status(200).json({ status: "OK" });
            } else {
              return res.status(500).json({ status: "Error al registrar la empresa" });
            }
          })
          .catch(error => {
            return res.status(500).json({ status: "Error al registrar la empresa" });
          });
      }
    } catch (error) {
      return res.status(500).json({ status: "Error al registrar la empresa" });
    }
  }
});


app.post("/registrocliente", async (req, res) => {
  const dbQuery = Cliente.query();
  try {
    const email = req.body.email;
    const resultado = await comprobarEmail(email);
    const emailExiste = resultado.cliente || resultado.admin || resultado.empresa;

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

    if (emailExiste) {
      return res.status(500).json({ error: "Este email ya está registrado" });
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
  } catch (error) {
    return res.status(500).json({ status: "Error al registrar el cliente" });
  }
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
          .then(insertar => {
            if (!!insertar) {
              return res.status(200).json({ status: "OK" });
            } else {
              return res.status(500).json({ status: "Error al registrar el evento" });
            }
          })
          .catch(error => {
            return res.status(500).json({ status: "Error al registrar el evento" });
          });
      })
      .catch(error => {
        return res.status(500).json({ status: "Error al buscar la empresa promotora" });
      });
  });
});



app.put("/verificarempresa", (req, res) => {
  const empresaId = req.body.id;

  EmpresaPromotora.query()
    .findOne({ id: empresaId })
    .then(empresa => {
      if (!empresa) {
        return res.status(404).json({ error: "La empresa no existe" });
      } else {
        EmpresaPromotora.query()
          .patch({ verificada: true })
          .where({ id: empresaId })
          .then(() => {
            return res.status(200).json({ status: "OK" });
          })
          .catch(error => {
            return res.status(500).json({ error: "Error al verificar la empresa" });
          });
      }
    })
    .catch(error => {
      return res.status(500).json({ error: "Error al buscar la empresa" });
    });
});

app.get("/mensajeverificada", (req, res) => {
  const empresaId = req.body.id;

  EmpresaPromotora.query()
    .findById(empresaId)
    .then(empresa => {
      if (empresa) {
        const verificada = empresa.verificada;
        if (verificada) {
          res.status(200).json({ mensaje: "La empresa está verificada" });
        } else {
          res.status(200).json({ mensaje: "La empresa no está verificada" });
        }
      } else {
        res.status(404).json({ error: "La empresa no existe" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error al obtener la información de la empresa" });
    });
});


app.get('/mostrarempresas', (req, res) => {
  const consulta = EmpresaPromotora.query();

  if (!!req.body && req.body !== {}) {
    // Filtrado por verificadas para admin
    if (req.body.verificada !== undefined) {
      consulta.where('verificada', req.body.verificada);
    }
  }

  consulta
    .then(resultado => res.status(200).json(resultado))
    .catch(err => res.status(500).json({ error: 'Error al obtener las empresas' }));
});



app.get('/mostrareventos', (req, res) => { //endpoint pa cliente
  const consulta = Evento.query();
  const fechaActual = moment().format('YYYY-MM-DD'); 

  consulta.where('fecha', '>', fechaActual);

  consulta
    .then(resultado => res.status(200).json(resultado))
    .catch(err => res.status(500).json({ error: 'Error al obtener los eventos' }));
});

app.get('/mostrareventos/empresa', (req, res) => { //endpoint pa empresas
  const consulta = Evento.query();
  const idempresa = req.body.id;
  const fechaActual = moment().format('YYYY-MM-DD'); 

  consulta.where('fecha', '>', fechaActual).where('empresa_promotora_id', idempresa); //empresas pueden ver los eventos suyos ya pasados?

  consulta
    .then(resultado => res.status(200).json(resultado))
    .catch(err => res.status(500).json({ error: 'Error al obtener los eventos' }));
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
              return res.status(200).json({ status: "OK" });
            } else {
              return res.status(500).json({ error: "Error al eliminar el cliente" });
            }
          })
          .catch(error => {
            return res.status(500).json({ error: "Error al eliminar el cliente" });
          });
      }
    })
    .catch(error => {
      return res.status(500).json({ error: "Error al buscar el cliente" });
    });
});

async function modVentas(eventos) {
  await Ventas.query()
    .whereIn('evento_id', eventos.map(evento => evento.id))
    .patch({ eventoId: null });
}

// LO MISMO QUE CLIENTE
app.delete("/eliminarempresa", (req, res) => {
  const dbQuery = EmpresaPromotora.query();
  const empresaId = req.body.id;

  dbQuery
    .findById(empresaId)
    .then(empresa => {
      if (!empresa) {
        return res.status(404).json({ error: "La empresa no existe" });
      } else {
        dbQuery
          .deleteById(empresaId)
          .then(contador => {
            if (contador > 0) {
              return res.status(200).json({ status: "OK" });
            } else {
              return res.status(500).json({ error: "Error al eliminar la empresa" });
            }
          })
          .catch(error => {
            return res.status(500).json({ error: "Error al eliminar la empresa" });
          });
      }
    })
    .catch(error => {
      return res.status(500).json({ error: "Error al buscar la empresa" });
    });
});


app.delete("/eliminarevento", (req, res) => {
  const dbQuery = Evento.query();
  const eventoId = req.body.id;

  dbQuery
    .findById(eventoId)
    .then(evento => {
      if (!evento) {
        return res.status(404).json({ error: "El evento no existe" });
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
                return res.status(200).json({ status: "OK" });
              } else {
                return res.status(500).json({ error: "Error al eliminar el evento" });
              }
            })
            .catch(error => {
              return res.status(500).json({ error: "Error al eliminar el evento" });
            });
        } else {
          return res.status(400).json({ error: "Quedan menos de 24H hasta el evento, no puede ser eliminado" });
        }
      }
    })
    .catch(error => {
      return res.status(500).json({ error: "Error al buscar el evento" });
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
        return res.status(404).json({ error: "El evento no existe" });
      } else {
        const fechaEvento = moment(evento.fecha, 'YYYY-MM-DD');
        const horaEvento = moment(evento.hora, 'HH:mm');
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
              ubicacion: ubicacionmod,
              aforo: aforomod,
              descripcion: descripcionmod,
              fecha: fechamod,
              hora: horamod,
              precio_entrada: preciomod,
            })
            .then(() => {
              return res.status(200).json({ status: "OK" });
            })
            .catch(error => {
              return res.status(500).json({ error: "Error al modificar la información del evento" });
            });
        } else {
          return res.status(400).json({ error: "Quedan menos de 24 horas hasta el evento, no se puede modificar" });
        }
      }
    })
    .catch(error => {
      return res.status(500).json({ error: "Error al buscar el evento" });
    });
});

async function actualizarAforo(Idevento, entradascompradas, res) { //No me funciona con res.status no se pq
  try {
    const evento = await Evento.query().findById(Idevento);
    if (!evento) {
      throw new Error("El evento no existe");
    }

    const aforoOcupado = evento.aforo_ocupado;
    const aforoMax = evento.aforo;
    const aforoDisponible = aforoMax - aforoOcupado;
    if (entradascompradas > aforoDisponible) {
      throw new Error("No hay suficientes entradas disponibles");
    }

    const nuevoAforoOcupado = aforoOcupado + entradascompradas;

    await Evento.query().findById(Idevento).patch({ aforo_ocupado: nuevoAforoOcupado });
  } catch (error) {
    res.status(400).json({ error: error.message });
    throw new Error("Error al modificar el aforo del evento: " + error.message);
  }
}


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
  }).then(async response => {
    const id = response.data._id;
    const eventoId = req.body.evento_id;
    const entradasCompradas = req.body.num_entradas;

    // Actualizar el aforo del evento
    await actualizarAforo(eventoId, entradasCompradas, res);

    const dbQuery = Ventas.query().insert({
      id,
      evento_id: eventoId,
      cliente_id: req.body.cliente_id,
      cantidad: req.body.cantidad,
      fecha_compra: req.body.fecha_compra,
      num_entradas: entradasCompradas
    }).then(dbRes => {
      return res.status(200).json({ status: 'OK' });
    }).catch(dbErr => {
      return res.status(500).json({ status: 'Error en la inserción en la base de datos' });
    });
  }).catch(paymentErr => {
    return res.status(500).json({ status: 'Error en la solicitud de pago' });
  });
});



app.get("/user", (req, res) => !!req.isAuthenticated() ? res.status(200).send(req.session.passport.user) : res.status(401).send('Sesión no iniciada!'));



// Definimos el puerto 8000 como puerto de escucha y un mensaje de confirmación cuando el servidor esté levantado
app.listen(8000, () => {
  console.log(`Servidor escuchando en el puerto 8000`);
});

