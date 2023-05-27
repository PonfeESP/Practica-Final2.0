import { useState } from "react";
import axios from 'axios';
import React from 'react';

import { TableCell, TableRow, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


export const Fila = ({evento}) => {
    
    const [open, setOpen] = useState(false);
    const [compra, setCompra] = useState('');

    const [tarjetaCredito, setTarjetaCredito] = useState('');
    const [cvv, setCVV] = useState('');
    const [caducidad, setCaducidad] = useState('');
    const [numEntradas, setNumEntradas] = useState('');

    const [tarjetaError, setTarjetaError] = useState(false);
    const [cvvError, setCVVError] = useState(false);
    const [caducidadError, setCaducidadError] = useState(false);
    const [numEntradasError, setNumEntradasError] = useState(false);
    const [eventoId, setEventoId] = useState(null); 
    const [verificacionMensaje, setVerificacionMensaje] = useState(null); 


    // Abrir Dialogf
    const handleClickOpen = (id) => { 
        setOpen(true);
        setEventoId(id); 
        fetchData(); 
    };
    
    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = () => {
        if (eventoId) {
          axios
            .get('http://localhost:8000/mensajeverificada', {
              params: {
                id: eventoId
              },
              withCredentials: true
            })
            .then(response => {
              const data = response.data;
              setVerificacionMensaje(data.mensaje);
            })
            .catch(error => {
              console.log('Error al obtener el mensaje de verificación', error);
            });
        }
      };
      

    const performCompra = (eventoId, precio) => {
        setTarjetaError(false);
        setCVVError(false);
        setCaducidadError(false);
        setNumEntradasError(false);

        if (cvv === '') setCVVError(true);
        if (numEntradas === '' || parseInt(numEntradas) <= 1) setNumEntradasError(true);
        if (caducidad === '') setCaducidadError(true);
        if (tarjetaCredito === '') setTarjetaError(true);

        if (!!cvv && !!numEntradas && !!caducidad && !!tarjetaCredito) {
            axios.post('http://localhost:8000/pago', {
                tarjeta_credito: tarjetaCredito,
                cvv: cvv,
                fecha_caducidad: caducidad,
                cantidad: Number(numEntradas * precio),
                evento_id: Number(eventoId),
                num_entradas: Number(numEntradas),
                fecha_compra: "2023-05-26"

                /*tarjeta_credito: "1234567890123456",
                cvv: "123",
                fecha_caducidad: "05/2027",
                cantidad: 4,
                evento_id: 22,
                num_entradas: 2,
                cliente_id: 17,
                fecha_compra: "2023-05-26"*/
            }, { withCredentials: true })
            .then((response) => {
                setCompra(response.data.id);
              })
            .catch((error) => {
                console.log('Error en la compra: ', error);
                setCompra('Error en la compra. Inténtalo de nuevo más tarde.');
            });
        }
    }

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
                <TableCell align="center">
                    <Button align="center" onClick={handleClickOpen}>COMPRAR ENTRADAS</Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>COMPRAR ENTRADAS</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Por favor, complete el siguiente formulario para realizar su compra.
                                <Typography> {verificacionMensaje && ` Estado de verificación: ${verificacionMensaje}`}</Typography>
                            </DialogContentText>
                            <TextField
                                required
                                onChange={(e) => setTarjetaCredito(e.target.value)}
                                margin="dense"
                                id="tarjeta_credito"
                                label="Número de Tarjeta"
                                fullWidth
                                variant="standard"
                                inputProps={{ maxLength: 16 }}
                                error={tarjetaError}
                                helperText={tarjetaError && 'Por favor, ingrese un Número de Tarjeta válido'}
                            />
                            <TextField
                                required
                                onChange={(e) => setCVV(e.target.value)}
                                margin="dense"
                                id="cvv"
                                label="CVV de la Tarjeta"
                                fullWidth
                                variant="standard"
                                inputProps={{ maxLength: 3 }}
                                error={cvvError}
                                helperText={cvvError && 'Por favor, ingrese un CVV válido'}
                            />
                            <TextField
                                required
                                onChange={(e) => setCaducidad(e.target.value)}
                                margin="dense"
                                id="caducidad"
                                label="Caducidad de la Tarjeta (MM/YYYY)"
                                fullWidth
                                variant="standard"
                                inputProps={{ maxLength: 7 }}
                                error={caducidadError}
                                helperText={caducidadError && 'Por favor, ingrese una Fecha de Caducidad válida'}
                            />
                            <TextField
                                required
                                onChange={(e) => setNumEntradas(e.target.value)}
                                margin="dense"
                                id="numentradas"
                                label="Número de Entradas"
                                fullWidth
                                variant="standard"
                                error={numEntradasError}
                                helperText={numEntradasError && 'Por favor, ingrese un Número de Entradas válido'}
                            />
                            {compra && <h4>{compra}</h4>}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>CANCELAR</Button>
                            <Button onClick={() => performCompra(evento.id, evento.precio_entrada)}>COMPRAR</Button>
                        </DialogActions>
                    </Dialog>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
