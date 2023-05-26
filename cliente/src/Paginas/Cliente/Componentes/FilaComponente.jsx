import { useState, useEffect } from "react";
import axios from 'axios';
import React from 'react';

import { TableCell, TableRow, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


export const Fila = fila => {
    
    const [open, setOpen] = useState(false);

    const [userData, setUserData] = useState();

    const [compra, setCompra] = useState('');
    const [tarjeta_credito, setTarjeta] = useState('');
    const [cvv, setCVV] = useState('');
    const [caducidad, setCaducidad] = useState('');
    const [numEntradas, setNumEntradas] = useState('');

    const [tarjetaError, setTarjetaError] = useState(false);
    const [cvvError, setCVVError] = useState(false);
    const [caducidadError, setCadError] = useState(false);
    const [numEntError, setNumEntError] = useState(false);

    // Abrir Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };
    /*
    useEffect(() => { // Obtener User
        axios({
            url: 'http://localhost:8000/user',
            method: 'GET',
            withCredentials: true,
            //timeout: 5000,
            //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
        })
        .then(res => {
          setUserData(res.data);
        })
        .catch(err => console.log(err))
    }, []);*/

    const performCompra = (idEvent, precio) => {
        setCVVError(false);
        setNumEntError(false);
        setCadError(false);
        setTarjetaError(false);

        if (cvv  === '') setCVVError(true);
        if (numEntradas  === '' || parseInt(numEntradas)<=1) setNumEntError(true);
        if (caducidad === '') setCadError(true);
        if (tarjeta_credito === '') setTarjetaError(true);

        if(!!cvv && !!numEntradas && !!caducidad && !!tarjeta_credito && !!userData){
            axios({
                url: 'http://localhost:8000/pago',
                method: 'POST',
                withCredentials: true,
                data: {
                  tarjeta_credito: tarjeta_credito,
                  cvv: cvv,
                  fecha_caducidad: caducidad,
                  cantidad: numEntradas*precio,
                  evento_id: idEvent,
                  num_entradas: numEntradas,
                  cliente_id: userData.id
                },
              })
              .then((response) => {
                  if (response.data.status === 'OK') {
                      setCompra('Has realizado su compra con éxito');
                  } else {
                      setCompra('Lo sentimos, pero no se ha podido realizar su compra');
                  }
              })
              .catch((error) => {
                  console.log('Error en la compra: ', error);
                  setCompra('Error en la compra. Inténtelo de nuevo más tarde.');
              });
        }
        
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                
                <TableCell>
                    <Typography>{fila.fila.nombre}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.artista}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.ubicacion}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.aforo}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.descripcion}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.fecha} {fila.fila.hora}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.precio_entrada}</Typography>
                </TableCell>
                <TableCell align="center">
                <Button align="center" onClick={handleClickOpen}>COMPRAR ENTRADAS</Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>COMPRAR ENTRADAS</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Por favor, complete el siguiente formulario para realizar su compra.
                    </DialogContentText>
                    <TextField
                        required
                        onChange={(e) => setTarjeta(e.target.value)}
                        margin="dense"
                        id="tarjeta_credito"
                        label="Número de Tarjeta"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 16 }}
                        error={tarjetaError}
                        helperText={tarjetaError && 'Por favor, ingrese un Número de Tarjeta Válido'}
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
                        helperText={cvvError && 'Por favor, ingrese un CVV Válido'}
                    />
                    <TextField
                        required
                        onChange={(e) => setCaducidad(e.target.value)}
                        margin="dense"
                        id="caducidad"
                        label="Caducidad de la Tarjeta(MM/YYYY)"
                        fullWidth
                        variant="standard"
                        inputProps={{ maxLength: 7 }}
                        error={caducidadError}
                        helperText={caducidadError && 'Por favor, ingrese una Fecha de Caducidad Válida'}
                    />
                    <TextField
                        required
                        onChange={(e) => setNumEntradas(e.target.value)}
                        margin="dense"
                        id="numentradas"
                        label="Número de Entradas"
                        fullWidth
                        variant="standard"
                        error={numEntError}
                        helperText={numEntError && 'Por favor, ingrese un Número de Entradas Válido'}
                    />
                    {compra && <h4>{compra}</h4>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>CANCELAR</Button>
                        <Button onClick={() => performCompra(fila.fila.id, fila.fila.precio_entrada)}>COMPRAR</Button>
                    </DialogActions>
                </Dialog>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}