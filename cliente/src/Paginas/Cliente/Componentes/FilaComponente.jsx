import { useState } from "react";
import axios from 'axios';
import React from 'react';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import QRCode from "react-qr-code";


import { TableCell, TableRow, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { axiosConfig } from "../../../constant/axiosConfig.constant";
import { useEffect } from 'react';



export const Fila = ({ evento }) => {

    const [open, setOpen] = useState(false);
    const [compra, setCompra] = useState('');
    const [ticket, setTicket] = useState('');

    const [tarjetaCredito, setTarjetaCredito] = useState('');
    const [cvv, setCVV] = useState('');
    const [caducidad, setCaducidad] = useState('');
    const [numEntradas, setNumEntradas] = useState('');

    const [tarjetaError, setTarjetaError] = useState(false);
    const [cvvError, setCVVError] = useState(false);
    const [caducidadError, setCaducidadError] = useState(false);
    const [numEntradasError, setNumEntradasError] = useState(false);
    const [verificacionMensaje, setVerificacionMensaje] = useState("");



    // Abrir Dialogf
    const handleClickOpen = (id) => {
        setOpen(true);
        setCompra(''); 
    };

    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        // Llamada al endpoint mensajeverificada
        axios.get('http://localhost:8000/mensajeverificada', {
            params: { id: evento.empresa_promotora_id }
        })
            .then(response => {
                const mensaje = response.data.mensaje;
                let verificacionMensaje = "";
                if (mensaje === "VERIFICADA") {
                    verificacionMensaje = "";
                } else if (mensaje === "NO VERIFICADA") {
                    verificacionMensaje = "Este evento pertenece a una empresa NO VERIFICADA";
                }
                setVerificacionMensaje(verificacionMensaje);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);



    const encrypt = (data, key) => {
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        return encryptedData;
    };

    const performCompra = (eventoId, precio) => {
        setTarjetaError(false);
        setCVVError(false);
        setCaducidadError(false);
        setNumEntradasError(false);
        setTicket('');
        setCompra('');
        const encryptedTarjeta = encrypt(tarjetaCredito, 'clave-secreta');
        const encryptedCVV = encrypt(cvv, 'clave-secreta');
        const encryptedCaducidad = encrypt(caducidad, 'clave-secreta');

        if (cvv === '' || cvv.length < 3) setCVVError(true);
        if (numEntradas === '' || !parseInt(numEntradas) || parseInt(numEntradas) <= 1) setNumEntradasError(true);
        if (caducidad === '' || caducidad.length < 7) setCaducidadError(true);
        if (tarjetaCredito === '' || tarjetaCredito.length < 16) setTarjetaError(true);

        if (cvvError === false && numEntradasError === false && caducidadError === false && tarjetaError === false) {
            axios({
                ...axiosConfig,
                url: 'http://localhost:8000/pago',
                method: 'POST',
                data: {
                    tarjeta_credito: encryptedTarjeta,
                    cvv: encryptedCVV,
                    fecha_caducidad: encryptedCaducidad,
                    cantidad: Number(numEntradas * precio),
                    evento_id: Number(eventoId),
                    num_entradas: Number(numEntradas),
                    fecha_compra: moment().format('YYYY-MM-DD')

                },
            })
                .then((response) => {
                    setTicket(response.data.id);
                    setCompra('Compra realizada con éxito, aquí tiene su QR.');
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
                <TableCell>
                    <Typography>{evento.aforo_ocupado}</Typography>
                </TableCell>
                <TableCell align="center">
                    <Button align="center" onClick={handleClickOpen}>COMPRAR ENTRADAS</Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>COMPRAR ENTRADAS</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Por favor, complete el siguiente formulario para realizar su compra.
                                <Typography>{verificacionMensaje}</Typography>
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
                                onKeyDown={(e) => {
                                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                    const isNumber = /^\d$/;
                                    if (!isNumber.test(e.key) && !allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
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
                                onKeyDown={(e) => {
                                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
                                    const isNumber = /^\d$/;
                                    const isSlash = /^[/]$/;
                                    if (!isNumber.test(e.key) && !isSlash.test(e.key) && !allowedKeys.includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <TextField
                                required
                                onChange={(e) => setNumEntradas(e.target.value)}
                                onKeyPress={(e) => {
                                    const keyCode = e.keyCode || e.which;
                                    const keyValue = String.fromCharCode(keyCode);
                                    const isValidKey = /^[0-9]+$/.test(keyValue);
                                    if (!isValidKey) {
                                        e.preventDefault();
                                    }
                                }}
                                margin="dense"
                                id="numentradas"
                                label="Número de Entradas"
                                fullWidth
                                variant="standard"
                                error={numEntradasError}
                                helperText={numEntradasError && 'Por favor, ingrese un Número de Entradas válido'}
                            />

                            {compra && <Typography>{compra}</Typography>}
                            {!!ticket && (
                                <div>
                                    <QRCode
                                        value={ticket}
                                    />
                                </div>
                            )}
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
