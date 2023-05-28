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

  }

  const performDeleteEvent = (idEvent) => {

  }

  const performModificar = (idEvent, ocupado) => {
    setAforoError(false);
    setFechaError(false);
    setHoraError(false);
    setPrecioError(false);
  
    let data = {
      id: idEvent,
      nombre: nombre !== '' ? nombre : evento.nombre,
      artista: artista !== '' ? artista : evento.artista,
      ubicacion: ubicacion !== '' ? ubicacion : evento.ubicacion,
      aforo: aforo !== '' ? aforo : evento.aforo,
      descripcion: descripcion !== '' ? descripcion : evento.descripcion,
      fecha: fecha !== '' ? fecha : evento.fecha,
      hora: hora !== '' ? hora : evento.hora,
      precio_entrada: precio_entrada !== '' ? precio_entrada : evento.precio_entrada
    };
  
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
                Por favor, complete el formulario de registro.
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
              />

              <TextField

                onChange={(e) => setHora(e.target.value)}
                margin="dense"
                id="hora"
                label={evento.hora}
                fullWidth
                variant="standard"
              />

              <TextField
                onChange={(e) => setPrecio(e.target.value)}
                margin="dense"
                id="aforo"
                label={evento.precio_entrada}
                fullWidth
                variant="standard"
              />

              {modifError && <p>{modifError}</p>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>CANCELAR</Button>
              <Button onClick={() => performModificar(evento.id, evento.ocupado)}>MODIFICAR EVENTO</Button>
            </DialogActions>
          </Dialog>

        </TableCell>
        {evento.cancelada === false &&
          <TableCell>
            <Typography> <Button onClick={() => performCancelar(evento.id)}>CANCELAR EVENTO</Button></Typography>
          </TableCell>
        }
        <TableCell>
          <Typography> <Button onClick={() => performDeleteEvent(evento.id)}>ELIMINAR EVENTO</Button></Typography>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}