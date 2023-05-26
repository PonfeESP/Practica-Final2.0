// Importaciones de React
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// Importación de Axios
import axios from 'axios';

// Importaciones de Material UI
import { Box, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import Button from '@mui/material/Button';

import { Fila } from './FilaComponente';
import { axiosConfig } from '../../../constant/axiosConfig.constant';

export const ClientePag = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState();
    const [logoutError, setLogoutError] = useState();

    //Declaración Empresas
    const [eventos, setEventos] = useState([{
        id: null,
        nombre: null,
        artista: null,
        ubicacion: null,
        aforo: null,
        descripcion: null,
        fecha: null,
        hora: null,
        precio_entrada: null,
        empresa_promotora_id: null,
        aforo_ocupado: null,
        cancelada: null
    }]);
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

    useEffect(() => {
        axios({
            ...axiosConfig,
            url: 'http://localhost:8000/mostrareventos',
            method: 'GET',
            
        })
            .then(res => {
                setEventos(res.data);
            })
            .catch(err => console.log(err))
    }, []);
/*

    const performLogout = (event) => {
        event.preventDefault();
        setLogoutError('');

        if (!!userData) {
            axios({
                url: 'http://localhost:8000/logout',
                method: 'POST',
                //timeout: 5000,
                //signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
            }).then((response) => {
                if (response.data.status === 'Ok')
                    navigate('/'); // Navega a la página de Inicio
                else
                    setLogoutError(response.data.error);
            })
                .catch((error) => {
                    console.log('Error en el cierre de sesión');
                    setLogoutError('Error en el Cierre de Sesión. Inténtelo más tarde.');
                })
        }
    };*/

    return(eventos.length > 0 && !!eventos[0].id && <div> 
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>NOMBRE EVENTO</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>ARTISTA</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>UBICACIÓN</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>AFORO</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>DESCRIPCIÓN</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>FECHA Y HORA</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>PRECIO/ENTRADA</Typography></TableCell>
                        <TableCell><Typography sx={{ fontWeight: 'bold' }}>¿QUIERE COMPRAR?</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {eventos.map((evento) => (
                        evento.aforo !== evento.aforo_ocupado && evento.cancelada === false && (
                            <Fila
                                evento={evento}
                            />
                        )
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    );
}

export default ClientePag;