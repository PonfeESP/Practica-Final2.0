import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import React from 'react';

import { TableCell, TableRow, Typography, Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

export const Fila = fila => {
    
    const [compra, setCompra] = useState('');
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    // Abrir Dialog
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };

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
                
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}