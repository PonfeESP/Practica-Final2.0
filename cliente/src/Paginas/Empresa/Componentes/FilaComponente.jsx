import React from 'react';
import { useState, useEffect } from 'react';

import axios from 'axios';

import { TableCell, TableRow, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { axiosConfig } from "../../../constant/axiosConfig.constant";

export const Fila = ({ evento }) => {

  const [open, setOpen] = useState(false);

  const [visible, setVisible] = useState(true);
  const [estado, setEstado] = useState('');

  const [nombre, setNombre] = useState();
  const [artista, setArtista] = useState();
  const [ubicacion, setUbicacion] = useState();
  const [aforo, setAforo] = useState();
  const [descripcion, setDesc] = useState();
  const [fecha, setFecha] = useState();
  const [hora, setHora] = useState();
  const [precio_entrada, setPrecio] = useState();

  const [aforoError, setAforoError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  const [horaError, setHoraError] = useState(false);
  const [precioError, setPrecioError] = useState(false);

  const [modifError, setModifError] = useState();

  // Abrir Dialogf
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Cerrar Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const performCancelar = (idEvent) => {
    setEstado('');
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/modificarevento',
      method: 'PUT',
      data: { id: idEvent, cancelada: true }
    })
      .then((response) => {
        if (response.data.status === 'OK') {
          setVisible(false);
          setEstado('CANCELADO')
        } else {
          setEstado(response.data.status);
        }
      })
      .catch((error) => {
        console.log('Error en la cancelación del Evento:', error);
        setEstado('Error en la cancelación del Evento.');
      });
  }

  const performDeleteEvent = (idEvent) => {
    setEstado('');
    axios({
      ...axiosConfig,
      url: 'http://localhost:8000/eliminarevento',
      method: 'DELETE',
      data: { id: idEvent }
    })
      .then((response) => {
        if (response.data.status === 'OK') {
          setVisible(false);
          setEstado('ELIMINADO')
        } else {
          setEstado(response.data.status);
        }
      })
      .catch((error) => {
        console.log('Error en la eliminación del Evento:', error);
        setEstado('Error en la eliminación del Evento.');
      });
  }

  const performModificar = (idEvent, ocupado) => {
    setAforoError(false);
    setFechaError(false);
    setHoraError(false);
    setPrecioError(false);

    let data = {
      id: idEvent
    };

    // Verificar y agregar campos modificados
    if (nombre !== '') data.nombre = nombre;
    if (artista !== '') data.artista = artista;
    if (ubicacion !== '') data.ubicacion = ubicacion;
    if (aforo !== '') data.aforo = aforo;

    if (descripcion !== '') data.descripcion = descripcion;
    if (fecha !== '') {
      // Validar fecha
      // ...
      data.fecha = fecha;
    }
    if (hora !== '') {
      // Validar hora
      // ...
      data.hora = hora;
    }
    if (precio_entrada !== '') {
      if (Number(precio_entrada) && Number(precio_entrada) >= 0) {
        data.precio_entrada = Number(precio_entrada);
      } else {
        setPrecioError(true);
      }
    }

    if (aforoError === false && precioError === false) {
      axios({
        ...axiosConfig,
        url: 'http://localhost:8000/modificarevento',
        method: 'PUT',
        data: data,
      })
        .then((response) => {
          if (response.data.status === 'OK') {
            setModifError('El Evento ha sido modificado con éxito. Actualiza la Página.');
          } else {
            setModifError(response.data.status);
          }
        })
        .catch((error) => {
          console.log('Error en la actualización del Evento:', error);
          setModifError('Error en la actualización del Evento.');
        });
    }
  };

  return (
    !!visible ?
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <Typography>{evento.nombre}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.artista}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.ubicacion}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.aforo}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.descripcion}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.fecha} {evento.hora}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.precio_entrada}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{evento.aforo_ocupado}</Typography>
          </TableCell>
          <TableCell>
            <Typography> <Button onClick={handleClickOpen}>MODIFICAR EVENTO</Button></Typography>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>MODIFICAR</DialogTitle>
              <DialogContent>

                <DialogContentText>
                  A continuación se muestra la información actual. Cambie lo que considere.
                </DialogContentText>

                <TextField

                  onChange={(e) => setNombre(e.target.value)}
                  margin="dense"
                  id="nombre"
                  label={evento.nombre}
                  fullWidth
                  variant="standard"
                />

                <TextField

                  onChange={(e) => setArtista(e.target.value)}
                  margin="dense"
                  id="artista"
                  label={evento.artista}
                  fullWidth
                  variant="standard"
                />

                <TextField

                  onChange={(e) => setUbicacion(e.target.value)}
                  margin="dense"
                  id="ubicacion"
                  label={evento.ubicacion}
                  fullWidth
                  variant="standard"
                />

                <TextField
                  onChange={(e) => setAforo(e.target.value)}
                  margin="dense"
                  id="aforo"
                  label={evento.aforo}
                  fullWidth
                  variant="standard"
                  onKeyDown={(e) => {
                    // Permitir solo números y teclas especiales como retroceso y flechas
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                    const isNumber = /^\d$/;
                    if (!isNumber.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />

                <TextField

                  onChange={(e) => setDesc(e.target.value)}
                  margin="dense"
                  id="descripcion"
                  label={evento.descripcion}
                  fullWidth
                  variant="standard"
                />

                <TextField

                  onChange={(e) => setFecha(e.target.value)}
                  margin="dense"
                  id="fecha"
                  label={evento.fecha}
                  fullWidth
                  variant="standard"
                  inputProps={{ maxLength: 10 }}
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                    const isNumber = /^\d$/;
                    const isSlash = /^[-]$/;
                    if (!isNumber.test(e.key) && !isSlash.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />

                <TextField

                  onChange={(e) => setHora(e.target.value)}
                  margin="dense"
                  id="hora"
                  label={evento.hora}
                  fullWidth
                  variant="standard"
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                    const isNumber = /^\d$/;
                    const isSlash = /^[:]$/;
                    if (!isNumber.test(e.key) && !isSlash.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />

                <TextField
                  onChange={(e) => setPrecio(e.target.value)}
                  margin="dense"
                  id="aforo"
                  label={evento.precio_entrada}
                  fullWidth
                  variant="standard"
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                    const isNumber = /^\d$/;
                    const isSlash = /^[.]$/;
                    if (!isNumber.test(e.key) && !isSlash.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />

                {modifError && <p>{modifError}</p>}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>CANCELAR</Button>
                <Button onClick={() => performModificar(evento.id, evento.ocupado)}>MODIFICAR EVENTO</Button>
              </DialogActions>
            </Dialog>

          </TableCell>

          <TableCell>
            <Typography> <Button onClick={() => performCancelar(evento.id)}>CANCELAR EVENTO</Button></Typography>
          </TableCell>

          <TableCell>
            <Typography> <Button onClick={() => performDeleteEvent(evento.id)}>ELIMINAR EVENTO</Button></Typography>
          </TableCell>
        </TableRow>
        {estado !== '' && <Typography>estado</Typography>}
      </React.Fragment> :
      <React.Fragment>

        <div align="center"><h5>El Evento ha sido {estado}</h5></div>

      </React.Fragment>
  );
}