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

import { axiosConfig } from "../../../constant/axiosConfig.constant";

export const Fila = ({evento}) => {
    
    const [open, setOpen] = useState(false);

    // Abrir Dialogf
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    // Cerrar Dialog
    const handleClose = () => {
        setOpen(false);
    };

    const performCancelar = (idEmp) => {

    }

    const performDeleteEvent = (idEmp) => {

    }

    const performModificar = (idEmp) => {

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
                <TableCell>
                    <Typography> <Button  onClick={handleClickOpen}>MODIFICAR EVENTO</Button></Typography>

                </TableCell>
                {evento.cancelada===false &&
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