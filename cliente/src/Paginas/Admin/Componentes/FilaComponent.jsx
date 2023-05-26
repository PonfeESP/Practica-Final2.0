import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import React from 'react';
import { TableCell, TableRow, Typography, Button } from "@mui/material";
import { axiosConfig } from "../../../constant/axiosConfig.constant";
// Componente de Visual,ización de Empresas
export const Fila = fila => {
    

    const [verifError, setVerifError] = useState('');
    const [elimError, setElimError] = useState('');

    const navigate = useNavigate();

    const performVerif = (idEmp) => {
        //Verificar userData.userType
        setVerifError('');
        axios({
            url: 'http://localhost:8000/verificarempresa',
            method: 'PUT',
            withCredentials: true,
            data: {
              id: idEmp
            },
        })
        .then((response) => {
            if (response.data.status === 'OK') {
                setVerifError('Empresa Verificada con EXITO');
                navigate('/admin');
            } else {
            setVerifError(response.data.error);
            }
        })
        .catch((error) => {
            console.log('Error en la verificación:', error);
            setVerifError('Error en la verificación. Inténtalo de nuevo, por favor.');
        });
    }


    //NO FUNCIONA
    const performBajaEmpresa = (idEmp) => {
        //Verificar userData.userType
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/eliminarempresa',
            method: 'DELETE',
            data: {
              id: idEmp
            },
        })
        .then((response) => {
            if (response.data.status === 'OK') {
                setElimError('Empresa Eliminada con EXITO');
                navigate('/admin');
            } else {
            setElimError(response.data.error);
            }
        })
        .catch((error) => {
            console.log('Error en la eliminación:', error);
            setElimError('Error en la eliminación. Inténtalo de nuevo, por favor.');
        });
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <Typography>{fila.fila.nombre_empresa}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.cif}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.domicilio_social}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.capital_social}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.persona_responsable}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.email}</Typography>
                </TableCell>
                <TableCell>
                    <Typography>{fila.fila.telefono}</Typography>
                </TableCell>
                {fila.fila.verificada===false && <TableCell align="center"><Button onClick={() => performVerif(fila.fila.id)}>VERIFICAR</Button></TableCell>}
                <TableCell align="center"><Button onClick={() => performBajaEmpresa(fila.fila.id)}>ELIMINAR EMPRESA</Button></TableCell>
            </TableRow>
            {!!verifError && <Typography>{verifError}</Typography>}
            {!!elimError && <Typography>{elimError}</Typography>}
        </React.Fragment>
    );
}